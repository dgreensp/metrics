'use strict';

const Ewma = require('./ewma');
const MetricsTypes = require('../constants').MetricsTypes;

/**
 * A meter which keeps an exponential moving average over 1, 5 and 15 minute durations, with each sample averaged over
 * five seconds.
 */
class Meter {
  constructor() {
    this._m1Rate = new Ewma(1 * 60 * 1000, 5 * 1000);
    this._m1Rate.start();

    this._m5Rate = new Ewma(5 * 60 * 1000, 5 * 1000);
    this._m5Rate.start();

    this._m15Rate = new Ewma(15 * 60 * 1000, 5 * 1000);
    this._m15Rate.start();

    this._count = 0;

    this.startTime = new Date().getTime();
    this._type = MetricsTypes.Meter;
  }

  get count() {
    return this._count;
  }

  get type() {
    return this._type;
  }

  get averages() {
    return [this._m1Rate, this._m5Rate, this._m15Rate];
  }

  /**
   * Updates the meter with the occurrence of an optional number of events.
   * @param {?number} [opt_value] If not provided, assumed to be 1.
   */
  update(opt_value) {
    let value = typeof opt_value === 'undefined' ? 1 : opt_value;

    this._count += value;
    this._m1Rate.update(value);
    this._m5Rate.update(value);
    this._m15Rate.update(value);
  }
}

module.exports = Meter;
