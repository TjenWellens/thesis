var _ = require('underscore');
var deepMatch = require('../../util/deep-match');
var createModel = require('./base');


var Code = createModel();

Code.getSnippet = function (language) {
  return Code.findOne({language: language});
}

Code.getLanguages = function () {
  return new Promise(function (resolve, reject) {
    return resolve(_.map(Code._all, function (snippet) {
      return snippet.language;
    }));
  });
}

module.exports = Code;
