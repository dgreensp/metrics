'use strict';

require('./test_helper');

const Meter = require('../src/meter');
const MetricsTypes = require('../constants').MetricsTypes;

describe('Meter', () => {
  let meter, sandbox;

  beforeEach(() => {
    meter = new Meter();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => sandbox.restore());

  it('instantiable', () => {
    assert.equal(meter.type, MetricsTypes.Meter);
    assert.equal(meter.count, 0);
  });

  /**
   * Should just call into the corresponding averages
   */
  it('mark', () => {
    let spies = meter.averages.map(avg => sandbox.spy(avg, 'update'));
    meter.update(100);

    spies.forEach(spy => {
      assert.ok(spy.called);
      assert.equal(spy.getCall(0).args[0], 100);
    });
  });
});
