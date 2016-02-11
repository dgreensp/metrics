// Configure NODE_ENV unless provided.
// Load config.test
const chai = require('chai');

/*global sinon:true*/
const sinon = require('sinon');

/**
 * Set up assertion/expectations to avoid duplication.
 */
global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = sinon;
global.self = {};

/**
 * Configure Chai
 */
if (process.env.HIDE_CHAI_STACK) {
  console.log('Hiding Chai stack traces');
  chai.config.includeStack = false;
} else {
  chai.config.includeStack = true;
}
