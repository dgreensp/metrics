'use strict';

/**
 * A simple sample that stores all values reported to it.
 */
class Sample {
  constructor() {
    this._values = [];
  }

  get size() {
    return this._values.length;
  }

  get values() {
    return this._values;
  }

  /**
   * Adds a value to the sample
   * @param {?} value
   */
  add(value) {
    this._values.push(value);
  }

  clear() {
    this._values = [];
  }
}

module.exports = Sample;
