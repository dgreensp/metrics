'use strict';

require('../test_helper');

const UniformSample = require('../../src/histogram/uniform_sample');

describe('Uniform sample', () => {
  let sample, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sample = new UniformSample(2);
  });

  afterEach(() => sandbox.restore());

  it('add', () => {
    sample.add(100);
    sample.add(200);
    assert.deepEqual(sample.values, [100, 200]);

    // Hit max value; subsequent request should start replacing elements
    sandbox.stub(sample, 'getRandomIndex').returns(0);
    sample.add(300);
    assert.deepEqual(sample.values, [300, 200]);
  });
});
