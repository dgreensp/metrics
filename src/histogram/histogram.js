'use strict';

const MetricsTypes = require('../../constants').MetricsTypes;

const DEFAULT_PERCENTILES = [0.001, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.98, 0.99, 0.999];

/**
 * A histogram tracks the distribution of items using a sampler to track items.
 */
class Histogram {
  /**
   * Creates a new histogram with the provided sample.
   * @param {Sample} sample
   */
  constructor(sample) {
    this.sample = sample;
    this.type = MetricsTypes.Histogram;

    this.clear();
  }

  get variance() {
    return this.count < 1 ? null : this.varianceS / (this.count - 1);
  }

  get mean() {
    return this.count === 0 ? null : this.varianceM;
  }

  get stdDev() {
    return this.count < 1 ? null : Math.sqrt(this.variance);
  }

  get values() {
    return this.sample.values;
  }

  /**
   * Ads a value to the histogram.
   * @param {number} value
   */
  add(value) {
    this.count = this.count + 1;
    this.sample.add(value);

    if (this.max === null) {
      this.max = value;
    } else {
      this.max = value > this.max ? value : this.max;
    }

    if (this.min === null) {
      this.min = value;
    } else {
      this.min = value < this.min ? value : this.min;
    }

    this.sum += value;
    this._updateVariance(value);
  }

  /**
   * Gets histogram values at the provided percentile values.
   * @param {[number]} [opt_percentiles]
   * @returns {{}}
   */
  getPercentiles(opt_percentiles) {
    const percentiles = opt_percentiles || DEFAULT_PERCENTILES;

    const values = this.sample.values.map(v => parseFloat(v)).sort((a, b) => a - b);
    let scores = {};

    for (let i = 0; i < percentiles.length; i++) {
      const percentile = percentiles[i];
      const pos = percentile * (values.length + 1);

      if (pos < 1) {
        scores[percentile] = values[0];
      }
      else if (pos >= values.length) {
        scores[percentile] = values[values.length - 1];
      }
      else {
        let lower = values[Math.floor(pos) - 1];
        let upper = values[Math.ceil(pos) - 1];
        scores[percentile] = lower + (pos - Math.floor(pos)) * (upper - lower);
      }
    }

    return scores;
  }

  clear() {
    this.sample.clear();
    this.min = null;
    this.max = null;
    this.sum = 0;

    // These are for the Welford algorithm for calculating running variance
    // without floating-point doom.
    this.varianceM = null;
    this.varianceS = null;
    this.count = 0;
  }

  /**
   * Returns an object that is the summary of this metric.
   * @returns {{}}
   */
  summary() {
    var percentiles = this.getPercentiles();
    return {
      type: this.type,
      min: this.min,
      max: this.max,
      sum: this.sum,
      variance: this.variance,
      mean: this.mean,
      std_dev: this.stdDev,
      count: this.count,
      median: percentiles[0.5],
      p75: percentiles[0.75],
      p95: percentiles[0.95],
      p99: percentiles[0.99],
      p999: percentiles[0.999]
    };
  }

  _updateVariance(value) {
    let oldVM = this.varianceM;
    let oldVS = this.varianceS;

    if (this.count === 1) {
      this.varianceM = value;
    } else {
      this.varianceM = oldVM + (value - oldVM) / this.count;
      this.varianceS = oldVS + (value - oldVM) * (value - this.varianceM);
    }
  }
}

module.exports = Histogram;
