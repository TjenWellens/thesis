var express = require('express');
var morgan = require('morgan');
var stylus = require('stylus');
var nib = require('nib');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var jsend = require('./middleware/jsend');
var mail = require('../util/mail');

module.exports = function (config, model) {
  var sendMail = mail(config.mail);

  var app = express();

  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(flash());
  app.use(session(config.session));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(jsend(config.jsend));

  app.set('view engine', 'jade');
  app.set('views', config.path('app/views'));

  app.use(stylus.middleware({
    src: config.path('app/css'),
    dest: config.path('app/dist/css'),
    compile: compileStylus
  }));

  app.use(express.static(config.path('app/dist')));
  app.use(express.static(config.path('app/static')));

  require('./routes/pages')(app, config, model);
  require('./routes/pages.contact')(app, config, model, sendMail);
  require('./routes/pages.experiment')(app, config, model);
  require('./routes/api')(app, config, model);
  require('./routes/auth')(app, config, model);
  require('./routes/auth.local')(app, config, model);
  require('./routes/auth.twitter')(app, config, model);
  require('./routes/auth.google')(app, config, model);

  // error handling
  app.use(function (err, req, res, next) {
    var status = err.status || 'error';
    var code = err.code || 500;
    var message = err.message || 'Internal error';

    console.error(err);
    err.stack && console.error(err.stack);
    res.status(code).send({
      status: status,
      code: code,
      message: message
    });
  });

  return app;
};

function compileStylus (str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}
