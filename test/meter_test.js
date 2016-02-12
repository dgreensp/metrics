'use strict';

require('./test_helper');

const Meter = require('../src/meter');
const MetricsTypes = require('../constants').MetricsTypes;

describe('Meter', () => {
  let meter, sandbox;

  beforeEach(() => {
    meter = new Meter();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => sandbox.restore());

  it('instantiable', () => {
    assert.equal(meter.type, MetricsTypes.Meter);
    assert.equal(meter.count, 0);
  });

  /**
   * Should just call into the corresponding averages
   */
  it('update', () => {
    const spies = meter.averages.map(avg => sandbox.spy(avg, 'update'));
    meter.update(100);

    spies.forEach(spy => {
      assert.ok(spy.called);
      assert.equal(spy.getCall(0).args[0], 100);
    });
  });

  it('summary', () => {
    meter.update(1000);
    meter.averages.forEach(avg => avg.tick());

    const summary = meter.summary();
    assert.equal(summary.type, MetricsTypes.Meter);
    assert.equal(summary.count, 1000);
    assert.deepEqual(summary.m1, meter.averages[0].average);
    assert.deepEqual(summary.m5, meter.averages[1].average);
    assert.deepEqual(summary.m15, meter.averages[2].average);
    assert.equal(summary.unit, 'seconds');
  });
});
