'use strict';

let Alehos = require('../index');
let sinon = require('sinon');
let expect = require('chai').expect;
let events = require('./events.json');
let _ = require('underscore');

let app;

describe('Alehos', () => {
  beforeEach(() => {
    app = new Alehos();
  });
  it('should return not supported for not register service yet', () => {
    const event = events.reqHealthCheck;
    const context = {};

    app.handler(event, context, (err, payload) => {
      expect(err).to.be.null;
      expect(payload).to.be.instanceof(Object)
        .and.has.property('header')
        .that.has.property('name', 'UnsupportedOperationError');
    });
  });

  it('should call the equivalent fuc with provided request type', () => {
    // given
    const event = events.reqHealthCheck;
    const context = {};
    app.healthCheck = sinon.spy();
    // when
    app.handler(event, context, (_err, _payload) => {});
    // then
    sinon.assert.calledWith(app.healthCheck, sinon.match.has('event', event));
  });

  it('should return the right payload from equivalent fnc', () => {
    // given
    const event = events.reqHealthCheck;
    const context = {};
    const healthCheckRes = {
      description: 'The system is currently healthy',
      isHealthy: true
    };
    // app.healthCheck = sinon.stub().yields(healthCheckRes);
    app.healthCheck = (req, cb) => {
      return cb(healthCheckRes);
    };
    // when
    let resSpy = sinon.spy();
    app.handler(event, context, resSpy);
    // then
    let matched = obj => {
      return obj.header.name === 'HealthCheckResponse' &&
        _.isEqual(obj.payload, healthCheckRes);
    };
    sinon.assert.calledWith(resSpy,
      null,
      sinon.match(matched)
    );
  });

  describe('Get Handler Function', () => {
    beforeEach(() => {
      app.discover = function(_req, _cb) {};
      app.onoff = function(_req, _cb) {};
      app.temperature = function(_req, _cb) {};
      app.percentage = function(_req, _cb) {};
      app.healthCheck = function(_req, _cb) {};
    });
    let expect = require('chai').expect;
    it('should call discovery fnc from discovery event', () => {
      // given
      const event = events.reqDiscovery;
      // when
      let hlrFn = app.getHlrFn(event.header.name);
      // then
      expect(hlrFn).to.eq(app.discover);
    });
    it('should call on/off fnc from turnOn event', () => {
      // given
      const event = events.reqTurnOn;
      // when
      let hlrFn = app.getHlrFn(event.header.name);
      // then
      expect(hlrFn).to.eq(app.onoff);
    });
    it('should call on/off fnc from turnOff event', () => {
      // given
      const event = events.reqTurnOff;
      // when
      let hlrFn = app.getHlrFn(event.header.name);
      // then
      expect(hlrFn).to.eq(app.onoff);
    });
    it('should call temperature fnc from set target temperature event', () => {
      // given
      const event = events.reqSetTargetTemperature;
      // when
      let hlrFn = app.getHlrFn(event.header.name);
      // then
      expect(hlrFn).to.eq(app.temperature);
    });
    it('should call temperature fnc from inc target temperature event', () => {
      // given
      const event = events.reqIncTargetTemperature;
      // when
      let hlrFn = app.getHlrFn(event.header.name);
      // then
      expect(hlrFn).to.eq(app.temperature);
    });
    it('should call temperature fnc from dec target temperature event', () => {
      // given
      const event = events.reqDecTargetTemperature;
      // when
      let hlrFn = app.getHlrFn(event.header.name);
      // then
      expect(hlrFn).to.eq(app.temperature);
    });
    it('should call percentage fnc from set percentage event', () => {
      // given
      const event = events.reqSetPercentage;
      // when
      let hlrFn = app.getHlrFn(event.header.name);
      // then
      expect(hlrFn).to.eq(app.percentage);
    });
    it('should call percentage fnc from inc percentage event', () => {
      // given
      const event = events.reqIncPercentage;
      // when
      let hlrFn = app.getHlrFn(event.header.name);
      // then
      expect(hlrFn).to.eq(app.percentage);
    });
    it('should call percentage fnc from dec percentage event', () => {
      // given
      const event = events.reqDecPercentage;
      // when
      let hlrFn = app.getHlrFn(event.header.name);
      // then
      expect(hlrFn).to.eq(app.percentage);
    });
    it('should call health check fnc from health check event', () => {
      // given
      const event = events.reqHealthCheck;
      // when
      let hlrFn = app.getHlrFn(event.header.name);
      // then
      expect(hlrFn).to.eq(app.healthCheck);
    });
  });
});
