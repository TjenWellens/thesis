var _ = require('underscore');
var readFile = require('./read-file');

module.exports = function (Model, file) {
  var seed = JSON.parse(readFile(file, 'utf8'));
  _.each(seed, function (data) {
    new Model(data).save();
  });
}
