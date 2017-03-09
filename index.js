'use strict';

let code = require('./lib/code');
let proc = require('./lib/proc');

let Alehos = function() {
  this.code = code;
  this.handlers = {};
};

/**
 * register a handling function with an event
 * the event should be: discover, onoff, temperature, percentage, healthCheck
 * the object will be wrote to handlers
 *
 * @param {string} name
 * @param {function} fnc
 */
Alehos.prototype.registerHandler = function(eventName, handler) {
  if (typeof handler !== 'function') {
    throw new Error(`Event handler for '${eventName}' was not a function`);
  }

  this.handlers[eventName] = handler;
};

/**
 * Given type of the request, provide handling function
 *
 * @param {string} type
 * @returns {function}
 */
Alehos.prototype._getHlrFn = function(type) {
  let fn;
  switch (type) {
    case this.code.REQUEST_HEALTHCHECK:
    fn = this.handlers['healthCheck'];
    break;

    case this.code.REQUEST_DISCOVER:
    fn = this.handlers['discover'];
    break;

    case this.code.REQUEST_TURN_ON:
    case this.code.REQUEST_TURN_OFF:
    fn = this.handlers['onoff'];
    break;

    case this.code.REQUEST_SET_TEMPERATURE:
    case this.code.REQUEST_INC_TEMPERATURE:
    case this.code.REQUEST_DEC_TEMPERATURE:
    fn = this.handlers['temperature'];
    break;

    case this.code.REQUEST_SET_PERCENTAGE:
    case this.code.REQUEST_INC_PERCENTAGE:
    case this.code.REQUEST_DEC_PERCENTAGE:
    fn = this.handlers['percentage'];
    break;
  }
  return fn;
};

/**
 * Main function to handle request, and give out response
 *
 * @param {object} event
 * @param {object} context
 * @param {function} cb
 * @returns no
 */
Alehos.prototype.handle = function(event, context, cb) {
  let type = event && event.header && event.header.name;
  let req = {
    event: event,
    context: context
  };

  let handFn = this._getHlrFn(type);

  let handFnCb = (err, payload) => {
    let res = {
      err: err,
      payload: payload
    };
    return cb(null, proc.genRes(req, res));
  };

  // without supported function
  if (handFn === undefined) {
    let err = new Error();
    err.code = this.code.ERROR_UNSUPPORTED_OPERATION;
    return handFnCb(err);
  }
  // else, call the handler function
  handFn(req, handFnCb);
};

module.exports = Alehos;
