var express = require('express');
var morgan = require('morgan');
var stylus = require('stylus');
var nib = require('nib');

module.exports = function (config) {
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

  app.get('/', function (req, res) {
    res.render('index', {title: 'Home'});
  });

  return app;
};

function compileStylus (str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}
