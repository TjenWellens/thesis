module.exports = function (options) {
  var message = (options && options.errorMessages) || {};
  var defaultMessage = (options && options.defaultMessage) || 'Unknown Error';
  var expect = options && options.expect;

  function succes (data) {
    return {
      status: 'success',
      data: data
    };
  }

  function error (statusCode, error) {
    return {
      status: 'error',
      code: statusCode,
      message: error || message['' + statusCode] || defaultMessage
    };
  }

  function middleware(req, res, next) {
    res.jsend = {};

    // Success: send
    res.jsend.success = function (data) {
      res.json(succes(data));
    };

    // Error: pass on to error handling
    // error handling should check for the jsend attribute
    // and remove it from the jsend
    res.jsend.error = function (statusCode, error) {
      var errorJsendObject = error(statusCode, error);
      errorJsendObject.jsend = true;
      next(errorJsendObject);
    };

    // this is middleware, so don't forget the next call
    next();
  }

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

  middleware.succes = succes;
  middleware.error = error;

  return middleware;
};
