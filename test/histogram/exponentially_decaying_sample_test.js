'use strict';

require ('../test_helper');

const ExponentiallyDecayingSample = require('../../src/histogram/exponentially_decaying_sample');

describe('Exponentially decaying sample', () => {
  let eds, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    eds = new ExponentiallyDecayingSample(3, 0.015);
  });

  it('add', () => {
    eds.add(0);
    assert.deepEqual([0], eds.values);
    assert.ok(eds._values.content[0].priority);

    // Add enough to fill up the sample set
    eds.add(1);
    eds.add(2);
    assert.deepEqual([0, 1, 2], eds.values.sort());

    // Next addition should trigger a replacement. Set priority to be less than
    // the first element to force an eviction
    sandbox.stub(eds, 'getPriority').returns(eds._values.peek().priority + 1);
    eds.add(100);
    assert.ok(eds.values.indexOf(100) !== -1);
  });

  it('rescale', () => {
    eds.add(1000);

    let originalValue = eds._values.content[0];
    eds.nextScaleTime = new Date().getTime() - 10000;


    let rescaleSpy = sandbox.spy(eds, 'rescale');
    eds.add(2000);
    assert.ok(rescaleSpy.called);

    // After rescale is complete, priority should have dropped
    let newValue = eds._values.content[0];
    assert.notEqual(originalValue.priority, newValue.priority);
    assert.ok(originalValue.priority > newValue.priority);

    assert.ok(eds.values.length, 2);
  });
});
