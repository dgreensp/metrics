'use strict';

require('./test_helper');

const Ewma = require('../src/ewma');

describe('Ewma', () => {
  let timePeriod, tickInterval, ewma;

  beforeEach(() => {
    timePeriod = 10 * 1000;
    tickInterval = 2 * 1000;
    ewma = new Ewma(timePeriod, tickInterval);
  });

  let computeAverage = function(runningAverage, intervalAverage) {
    return (1 - ewma.alpha) * runningAverage + intervalAverage * ewma.alpha;
  };

  it('instantiable', () => {
    assert.equal(ewma.alpha, 1 - Math.exp(-1 * tickInterval / timePeriod));
  });

  it('average', () => {
    let runningAverage;

    // First tick
    ewma.update(10);
    ewma.tick();
    assert.equal(ewma.average, 10 / tickInterval);
    runningAverage = ewma.average;

    // Further updates
    for (let i = 0; i < 5; i++) {
      let intervalAverage = 100 / tickInterval;

      ewma.update(100);
      ewma.tick();

      assert.equal(ewma.average, computeAverage(runningAverage, intervalAverage));
      runningAverage = ewma.average;
    }
  });

  it('tick, start, stop', () => {
    let iteration = 1, runningAverage = null, intervalAverage, promise;

    tickInterval = 0.001;
    ewma = new Ewma(timePeriod, tickInterval);
    intervalAverage = 100 / tickInterval;
    ewma.update(100);

    promise = new Promise(resolve => {
      ewma.start((oldAverage, newAverage) => {
        let computedAverage;
        if (iteration === 1) {
          computedAverage = intervalAverage;
        } else {
          computedAverage = computeAverage(runningAverage, iteration / tickInterval);
        }

        assert.equal(oldAverage, runningAverage);
        assert.equal(newAverage, computedAverage);
        runningAverage = newAverage;

        ewma.update(iteration + 1);
        if (iteration === 20) {
          ewma.stop();
          resolve();
        }

        iteration++;
      });
    });

    return promise.then(() => assert.equal(iteration, 21));
  });
});
