var _ = require('underscore');
var createModel = require('../../util/create-base-model');


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
