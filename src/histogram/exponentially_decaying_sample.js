'use strict';

const BinaryHeap = require('../lib/binary_heap');
const Sample = require('./sample');

const RESCALE_THRESHOLD_MS = 60 * 60 * 1000;

/**
 * Take an exponentially decaying sample of a provided maxsize.
 */
class ExponentiallyDecayingSample extends Sample {
  /**
   * Creates a new sample.
   * @param {number} maxSize
   * @param {number} alpha
   */
  constructor(maxSize, alpha) {
    super();

    this.maxSize = maxSize;
    this.alpha = alpha;
    this.clear();
  }

  get values() {
    return this._values.clone().content.map(element => element.value);
  }

  clear() {
    let now = new Date().getTime();

    this._values = ExponentiallyDecayingSample._newHeap();
    this.count = 0;

    this.startTimeMs = now;
    this.nextScaleTime = now + RESCALE_THRESHOLD_MS;
  }

  add(value) {
    let now = new Date().getTime();
    let priority = this.getPriority(now - this.startTimeMs);
    let newValue = {value, priority};

    if (this.count < this.maxSize) {
      this.count ++;
      this._values.push(newValue);
    } else {
      let first = this._values.peek();
      if (first.priority < priority) {
        this._values.pop();
        this._values.push(newValue);
      }
    }

    if (now > this.nextScaleTime) {
      this.rescale(now);
    }
  }

  rescale(now) {
    let oldStartTime = this.startTimeMs;
    this.startTimeMs = now;

    this.nextScaleTime = now + RESCALE_THRESHOLD_MS;

    // Downscale every priority by the same factor.
    let downscaleFactor = this.startTimeMs - oldStartTime;

    // Order is unaffected, which is why we're avoiding the cost of popping.
    let newContent = [];
    let oldContent = this._values.content;
    for (let i = 0; i < oldContent.length; i++) {
      newContent.push({
        value: oldContent[i].value,
        priority: oldContent[i].priority * Math.exp(-this.alpha * downscaleFactor)
      });
    }

    this._values.content = newContent;
  }

  /**
   * Gets the priority for an item with the provided age. Setup separately for stubbing in test cases.
   */
  getPriority(ageMs) {
    return this._getWeight(ageMs) / Math.random();
  }

  static _newHeap() {
    return new BinaryHeap(obj => obj.priority);
  }

  _getWeight(ageMs) {
    return Math.exp(this.alpha * (ageMs / 1000));
  }
}

module.exports = ExponentiallyDecayingSample;
