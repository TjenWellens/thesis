var _ = require('underscore');
var mongoose = require('mongoose');
var models = require('../server/models/models')(mongoose);

var config = require('../server/config');
var getSnippets = require('./languages');

// connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.database.url)
  .then(function () {
    console.log('---Connected to db ' + config.database.url);
  })
  .then(function () {
    var Code = models.code;
    var snippets = getSnippets();
    _.each(snippets, function (snippet) {
      new Code(snippet).save();
    });
    process.exit(0);
  })
  .catch(function (err) {
    console.error('Failed to connect with database: ', err);
    console.log('Failed to connect with database: ', err);
    process.exit(1);
  });