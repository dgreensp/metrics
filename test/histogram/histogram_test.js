'use strict';

require('../test_helper');

const Histogram = require('../../src/histogram/histogram');
const MetricsTypes = require('../../constants').MetricsTypes;
const Sample = require('../../src/histogram/sample');

describe('Histogram', () => {
  let histogram;

  beforeEach(() => histogram = new Histogram(new Sample()));

  it('instantiable', () => {
    assert.equal(histogram.type, MetricsTypes.Histogram);
  });

  it('add', () => {
  });
});
