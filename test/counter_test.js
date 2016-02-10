'use strict';

require ('./test_helper');

const Counter = require('../src/counter');
const MetricsTypes = require('../constants').MetricsTypes;

describe('Counter', () => {
  let counter;

  beforeEach(() => counter = new Counter());

  it('instantiable', () => {
    assert.equal(counter.count, 0);
    assert.equal(counter.type,  MetricsTypes.Counter)
  });

  describe('increment', () => {
    it('no value', () => {
      counter.increment();
      assert.equal(counter.count, 1);
    });

    it('non zero value', () => {
      counter.increment(10);
      assert.equal(counter.count, 10);
    });

    it('zero value', () => {
      counter.increment(0);
      assert.equal(counter.count, 0);
    });

    it('max value', () => {
      counter.increment(4294967296);
      assert.equal(counter.count, 4294967296);

      counter.increment();
      assert.equal(counter.count, 0);
    });
  });

  describe('decrement', () => {
    beforeEach(() => counter.increment(10));

    it('no value', () => {
      counter.decrement();
      assert.equal(counter.count, 9);
    });

    it('non zero value', () => {
      counter.decrement(5);
      assert.equal(counter.count, 5);
    });

    it('zero value', () => {
      counter.decrement(0);
      assert.equal(counter.count, 10);
    });

    it('min value', () => {
      counter.decrement(10);
      assert.equal(counter.count, 0);

      counter.decrement();
      assert.equal(counter.count, 0);
    });
  });
});
