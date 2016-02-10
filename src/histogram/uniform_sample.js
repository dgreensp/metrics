'use strict';
const Sample = require('./sample');

/**
 * Take a uniform sample with a max sample size.
 */
class UniformSample extends Sample {
  /**
   * Creates a new sample with the provided max size.
   * @param {number} maxSize
   */
  constructor(maxSize) {
    super();

    this.maxSize = maxSize;
    this._count = 0;
  }

  /**
   * Adds a value to the sample.
   * @param {?} value
   */
  add(value) {
    this._count++;

    if (this.size < this.maxSize) {
      this.values.push(value);
    } else {
      let rand = this.getRandomIndex(this._count);
      if (rand < this.maxSize) {
        this.values[rand] = value;
      }
    }
  }

  /**
   * Gets the random index into which the sample should be inserted. Public because it can be mocked for testing.
   */
  getRandomIndex(maxCount) {
    return parseInt(Math.random() * maxCount);
  }
}

module.exports = UniformSample;
