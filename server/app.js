var express = require('express');

module.exports = function () {
  var app = express();

  app.set('view engine', 'jade');

  app.get('/', function (req, res) {
    res.render('index', {
      pageTitle: "Title",
      youAreUsingJade: true,
    });
  });

  return app;
};
