module.exports = {
  Counter: require('./src/counter'),
  ExponentiallyDecayingSample: require('./src/histogram/exponentially_decaying_sample'),
  Histogram: require('./src/histogram/histogram'),
  Meter: require('./src/meter'),
  Sample: require('./src/histogram/sample'),
  UniformSample: require('./src/histogram/uniform_sample')
};
