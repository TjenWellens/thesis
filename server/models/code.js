var _ = require('underscore');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  language: String,
  code: [String],
  rows: Number,
  cols: Number,
});

schema.methods.calculatExtraProperties = function () {
  this.rows = this.code.length;
  this.cols = _.reduce(this.code, function (memo, line) {
    return Math.max(memo, line.length);
  }, 0);
};

schema.statics.getSnippet = function (language) {
  return this.findOne({language: language});
}

schema.statics.getLanguages = function () {
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

schema.pre('save', function (next) {
  this.calculatExtraProperties();
  next();
});

module.exports = mongoose.model('Code', schema);
