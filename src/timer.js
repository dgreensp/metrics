'use strict';

const Meter = require('./meter');
const MetricsTypes = require('../constants').MetricsTypes;
const Histogram = require('./histogram/histogram');
const ExponentiallyDecayingSample = require('./histogram/exponentially_decaying_sample');


/**
 * A timer that tracks the rate of events and histograms the durations.
 */
class Timer {
  constructor() {
    this.meter = new Meter();
    this.histogram = new Histogram(new ExponentiallyDecayingSample(1028, 0.015));

    this.clear();
    this.type = MetricsTypes.Timer;
  }

  clear() {
    this.histogram.clear();
  }

  update(duration) {
    this.histogram.add(duration);
    this.meter.update();
  }

  summary() {
    return {
      type: this.type,
      duration: this.histogram.summary(),
      rate: this.meter.summary()
    };
  }
}

module.exports = Timer;
