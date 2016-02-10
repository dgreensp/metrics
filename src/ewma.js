'use strict';

/**
 * Maintains an exponentially weighted moving average where:
 *  - Weight is defined on a tickInterval, with more weight given to recent samples.
 *  - Samples in a timePeriod are averaged.
 *
 * S(t) = alpha * Y(t) + (1 - alpha) * S(t-1)
 * Y(t) = count of samples in timePeriod / timePeriod - (simple average)
 * alpha = exp(-1 * tickInterval / timePeriod).
 *
 * This allows you define for example: The weighted average over the last 15 minutes of request queue length where each
 * queue length sample is an average over 5 seconds.
 */
class Ewma {
  /**
   * Creates a new exponential weighted moving average.
   * @param {number} timePeriodSeconds Duration in seconds over which the moving average is computed.
   * @param {number} tickIntervalSeconds Duration in seconds over which a single average sample is computed.
   */
  constructor(timePeriodSeconds, tickIntervalSeconds) {
    this._alpha = Ewma.createAlpha(tickIntervalSeconds, timePeriodSeconds);

    this._tickIntervalSeconds = tickIntervalSeconds;

    this._average = null;
    this._currentIntervalCount = 0;

    this._tickCallback = null;
  }

  get alpha() {
    return this._alpha;
  }

  get average() {
    return this._average;
  }

  start(opt_onTickCallback) {
    this._tickCallback = setInterval(() => this.tick(opt_onTickCallback), this._tickIntervalSeconds);
    this._tickCallback.unref();
  }

  stop() {
    clearInterval(this._tickCallback);
  }

  update(opt_value) {
    this._currentIntervalCount = typeof opt_value === 'undefined' ? 1 : opt_value;
  }

  tick(opt_onTickCallback) {
    let oldAverage = this._average;
    let currentIntervalAverage = this._currentIntervalCount / this._tickIntervalSeconds;

    if (this._average === null) {
      // First time that rate is being computed
      this._average = currentIntervalAverage;
    } else {
      this._average = this._alpha * currentIntervalAverage + (1 - this._alpha) * this._average;
    }

    // Reset for next interval
    this._currentIntervalCount = 0;

    if (opt_onTickCallback) {
      opt_onTickCallback(oldAverage, this._average);
    }
  }

  static createAlpha(tickIntervalSeconds, timePeriodSeconds) {
    return 1 - Math.exp(-1 * tickIntervalSeconds / timePeriodSeconds);
  }
}

module.exports = Ewma;
