var _ = require('underscore');
var createModel = require('../../util/create-base-model');

var Code = createModel();

Code.prototype.calculatExtraProperties = function () {
  this.rows = this.code.length;
  this.cols = _.reduce(this.code, function (memo, line) {
    return Math.max(memo, line.length);
  }, 0);
}

Code.getSnippet = function (language) {
  return this.findOne({language: language});
}

Code.getLanguages = function () {
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

module.exports = Code;
