'use strict';

const MetricsTypes = require('../constants').MetricsTypes;

/**
 * JavaScript uses double-precision FP for all numeric types.
 * Perhaps someday we'll have native 64-bit integers that can safely be
 * transported via JSON without additional code, but not today.
 */
const MAX_COUNTER_VALUE = Math.pow(2, 32); // 4294967296

/**
 * Defines a simple counter.
 */
class Counter {
  constructor() {
    this._count = 0;
    this._type = MetricsTypes.Counter;
  }

  get count() {
    return this._count;
  }

  get type() {
    return this._type;
  }

  /**
   * Increments the counter by the provided value.
   * @param {?number} [opt_value] Increment count. If not provided, defaults to 1.
   */
  increment(opt_value) {
    let value = typeof opt_value === 'undefined' ? 1 : opt_value;

    this._count += value;

    // Wrap counter if necessary.
    if (this._count > MAX_COUNTER_VALUE) {
      this._count -= (MAX_COUNTER_VALUE + 1);
    }
  }

  /**
   * Decrements the counter by the provided value.
   * @param {?number} [opt_value] Increment count. If not provided, defaults to 1.
   */
  decrement(opt_value) {
    let value = typeof opt_value === 'undefined' ? 1 : opt_value;

    this._count -= value;

    // Prevent counter from being decremented below zero.
    if (this._count < 0) {
      this._count = 0;
    }
  }

  /**
   * Returns an object that is the summary of this metric.
   * @returns {{}}
   */
  summary() {
    return {
      type: this.type,
      count: this._count
    };
  }
}

module.exports = Counter;

