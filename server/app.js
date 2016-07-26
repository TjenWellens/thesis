var express = require('express');
var morgan = require('morgan');
var stylus = require('stylus');
var nib = require('nib');

module.exports = function (config, model) {
  var app = express();

  app.set('view engine', 'jade');
  app.set('views', config.path('app/views'));

  app.use(morgan('dev'));

  app.use(stylus.middleware({
    src: config.path('app/stylesheets'),
    dest: config.path('public/stylesheets'),
    compile: compileStylus
  }));

  app.use(express.static(config.path('public')));

  app.get('/', render.index);
  app.get('/experiment', render.experiment);
  app.get('/about', render.about);
  app.get('/contact', render.contact);

  require('./routes/api')(app, config, model);

  return app;
};

function compileStylus (str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}

var render = {
  index: function (req, res) {
    res.redirect('/experiment');
  },
  experiment: function (req, res) {
    res.render('experiment', {page: 'experiment', title: 'Deliberate Practice Test'});
  },
  about: function (req, res) {
    res.render('about', {page: 'about', title: 'About'});
  },
  contact: function (req, res) {
    res.render('contact', {page: 'contact', title: 'Contact'});
  },
}
