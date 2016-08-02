var mongoose = require('mongoose');
var _ = require('underscore');

var codeSchema = new mongoose.Schema({
  language: String,
  code: [String],
  rows: Number,
  cols: Number,
});

codeSchema.methods.calculatExtraProperties = function calculatExtraProperties () {
  this.rows = this.code.length;
  this.cols = _.reduce(this.code, function (memo, line) {
    return Math.max(memo, line.length);
  }, 0);
};

codeSchema.statics.getSnippet = function (language) {
  return this.findOne({language: language});
}

codeSchema.statics.getLanguages = function () {
  return new Promise(function (resolve, reject) {
    this.find()
      .then(function (snippets) {
        return _.map(snippets, function (snippet) {
          return snippet.language;
        })
      })
      .then(resolve)
      .catch(reject);
  });
}

codeSchema.pre('save', function (next) {
  this.calculatExtraProperties();
  next();
});

module.exports = mongoose.model('Code', codeSchema);
