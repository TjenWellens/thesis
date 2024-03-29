module.exports = function (options) {
  var message = (options && options.errorMessages) || {};
  var defaultMessage = (options && options.defaultMessage) || 'Unknown Error';

  // only needed for unit tests
  var expect = options && options.expect;

  function createSuccessObject (data) {
    return {
      status: 'success',
      data: data
    };
  }

  function createErrorObject (statusCode, error) {
    return {
      status: 'error',
      code: statusCode,
      message: error || message['' + statusCode] || defaultMessage
    };
  }

  function middleware (req, res, next) {
    res.jsend = {};

    // Success: send
    res.jsend.success = function (data) {
      res.json(createSuccessObject(data));
    };

    // Error: pass on to error handling
    // error handling should check for the jsend attribute
    // and remove it from the jsend
    res.jsend.error = function (statusCode, error) {
      var errorJsendObject = createErrorObject(statusCode, error);
      errorJsendObject.jsend = true;
      next(errorJsendObject);
    };

    // this is middleware, so don't forget the next call
    next();
  }

  // only needed for unit tests
  middleware.validate = function (res) {
    expect(res).to.be.an('object');
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status');
    switch (res.body.status) {
      case 'success':
        expect(res.body).to.have.property('data');
        break;

      case 'fail':
        expect(res.body).to.have.property('data');
        break;

      case 'error':
        expect(res.body).to.have.property('message');
        break;

      default:
        expect().fail("status '" + res.body.status + "' not allowed");
    }
  };

  middleware.succes = createSuccessObject;
  middleware.error = createErrorObject;

  return middleware;
};
