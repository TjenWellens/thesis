var nodemailer = require('nodemailer');
var _ = require('underscore');

module.exports = function (options) {
  // create reusable transporter object using the default SMTP transport
  var email = encodeURIComponent(options.email);
  var uri = 'smtps://' + email + ':' + options.password + '@' + options.provider;
  var transporter = nodemailer.createTransport(uri);

  function sendMail (data) {
    return new Promise(function (resolve, reject) {
      var sendData = _.extend({}, options.defaultData, data);

      // send mail with defined transport object
      transporter.sendMail(sendData, function (error, info) {
        if (error)
          reject(error);
        else
          resolve(info);
      });
    });
  }

  return sendMail;
};
