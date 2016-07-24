var express = require('express');

module.exports = function (config) {
  var app = express();

  app.get('/', function (req, res, next) {
    res.send('Hello World');
  });

  return app;
};
