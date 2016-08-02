var _ = require('underscore');
var mongoose = require('../../util/fake-mongoose');

var Code = new mongoose.Schema();

Code.methods.calculatExtraProperties = function () {
  this.rows = this.code.length;
  this.cols = _.reduce(this.code, function (memo, line) {
    return Math.max(memo, line.length);
  }, 0);
}

Code.statics.getSnippet = function (language) {
  return this.findOne({language: language});
}

Code.statics.getLanguages = function () {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.find()
      .then(function (snippets) {
        return _.map(snippets, function (snippet) {
          return snippet.language;
        })
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = mongoose.model('Code', Code);
