'use strict';

require('../test_helper');

const Sample = require('../../src/histogram/sample');

describe('Sample', () => {
  let sample;

  beforeEach(() => sample = new Sample());

  it('instantiable', () => {
    assert.equal(sample.size, 0);
  });

  it('add', () => {
    sample.add('foo');
    sample.add(10);

    assert.equal(sample.size, 2);
    assert.deepEqual(sample.values, ['foo', 10]);
  });

  it('clear', () => {
    sample.add('foo');
    assert.deepEqual(sample.values, ['foo']);

    sample.clear();
    assert.deepEqual(sample.values, []);
  });
});
