var express = require('express');
var morgan = require('morgan');
var stylus = require('stylus');
var nib = require('nib');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

module.exports = function (config, model) {
  var app = express();

  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.set('view engine', 'jade');
  app.set('views', config.path('app/views'));

  app.use(stylus.middleware({
    src: config.path('app/css'),
    dest: config.path('app/dist/css'),
    compile: compileStylus
  }));

  app.use(express.static(config.path('app/dist')));
  app.use(express.static(config.path('app/static')));

  app.get('/', redirectExperiment);
  app.get('/experiment', render.experiment);
  app.get('/about', render.about);
  app.get('/contact', render.contact);
  app.get('/login', render.login);
  app.get('/register', render.register);

  require('./routes/api')(app, config, model);
  require('./routes/login')(app, config, model);

  // error handling
  app.use(function (err, req, res, next) {
    var status = err.status || 'error';
    var code = err.code || 500;
    var message = err.message || 'Internal error';

    console.error(err);
    console.error(err.stack);
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

function redirectExperiment (req, res) {
  res.redirect('/experiment');
}

var render = {
  experiment: function (req, res) {
    res.render('experiment', {page: 'experiment', title: 'Deliberate Practice Test'});
  },
  about: function (req, res) {
    res.render('about', {page: 'about', title: 'About'});
  },
  contact: function (req, res) {
    res.render('contact', {page: 'contact', title: 'Contact'});
  },
  login: function (req, res) {
    res.render('login', {page: 'login', title: 'Login'});
  },
  register: function (req, res) {
    res.render('register', {page: 'register', title: 'Register'});
  },
};
