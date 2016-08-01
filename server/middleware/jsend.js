module.exports = function (options) {
  var message = (options && options.errorMessages) || {};
  var defaultMessage = (options && options.defaultMessage) || 'Unknown Error';
  return function (req, res, next) {
    res.jsend = {};

    // Success: send
    res.jsend.success = function (data) {
      res.json({
        status: 'success',
        data: data
      });
    };

    // Error: pass on to error handling
    // error handling should check for the jsend attribute
    // and remove it from the jsend
    res.jsend.error = function (statusCode, error) {
      next({
        jsend: true,
        status: 'error',
        code: statusCode,
        message: error || message['' + statusCode] || defaultMessage
      });
    };

    // this is middleware, so don't forget the next call
    next();
  }
};
