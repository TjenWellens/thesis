var expect = require('chai').expect;
var _ = require('underscore');

var options = {
  expect: expect,
  errorMessages: {
    '404': 'Not Found',
  },
  defaultMessage: 'default-msg',
};

var jsendMiddleware = require('../server/middleware/jsend')(options);

var UNKNOWN_ERROR_CODE = 123;
var DEFAULT_ERROR_MESSAGE = 'default-msg';
var KNOWN_ERROR_CODE = 404;
var KNOWN_ERROR_MESSAGE = 'Not Found';

var INPUT = {foo: 'bar'};

describe('jsend', function () {
  describe('middleware', function () {
    var req = null;
    var res = {};
    var next = function () {
    };

    it('should add jsend.success() and jsend.error() to res', function () {
      jsendMiddleware(req, res, next);

      expect(res).to.have.property('jsend').to.be.an('object');
      expect(res.jsend).to.have.property('success').to.be.a('function');
      expect(res.jsend).to.have.property('error').to.be.a('function');
    });

    it('should call next()', function (done) {
      // next needs to be called or test needs to fail
      // which will happen because done needs to be called
      var next = done;
      jsendMiddleware(req, res, next);
    });

    it('res.success() should send success to res.json()', function (done) {
      var res = {
        json: function (data) {
          expect(data).to.eql(jsendMiddleware.succes(INPUT));
          done();
        }
      };

      jsendMiddleware(req, res, next);
      res.jsend.success(INPUT);
    });

    it('res.error() should send next and add flag jsend', function (done) {
      var expected = jsendMiddleware.error(KNOWN_ERROR_CODE);
      expected.jsend = true;

      var next = function (data) {
        // ignore the empty next() call of the middleware registration
        if (!data) return;

        expect(data).to.eql(expected);
        done();
      };

      jsendMiddleware(req, res, next);
      res.jsend.error(KNOWN_ERROR_CODE);
    });
  });

  describe('message types', function () {
    it('success should wrap correct', function () {
      var success = jsendMiddleware.succes(INPUT);
      expect(success).to.have.property('status').to.equal('success');
      expect(success).to.have.property('data').to.eql(INPUT);
    });

    it('error with known error code should show message', function () {
      var statusCode = KNOWN_ERROR_CODE;
      var expectedMessage = KNOWN_ERROR_MESSAGE;

      var error = jsendMiddleware.error(statusCode);
      expect(error).to.have.property('status').to.equal('error');
      expect(error).to.have.property('code').to.eql(statusCode);
      expect(error).to.have.property('message').to.eql(expectedMessage);
    });

    it('error with unknown error code should show message', function () {
      var statusCode = UNKNOWN_ERROR_CODE;
      var expectedMessage = DEFAULT_ERROR_MESSAGE;

      var error = jsendMiddleware.error(statusCode);
      expect(error).to.have.property('status').to.equal('error');
      expect(error).to.have.property('code').to.eql(statusCode);
      expect(error).to.have.property('message').to.eql(expectedMessage);
    });
  });
});
