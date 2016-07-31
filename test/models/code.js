var _ = require('underscore');
var readFile = require('../../util/read-file');
var deepMatch = require('../../util/deep-match');

var snippets = [];

function Code (data) {
  _.extend(this, data);
}

Code._all = snippets;

Code.prototype.save = function () {
  var snippet = this;
  return new Promise(function (resolve, reject) {
    snippet._id = snippets.length;
    snippets.push(snippet);
    resolve(snippet);
  });
}

Code.findOne = function (searchData) {
  return new Promise(function (resolve, reject) {
    var matchingItem = _.find(snippets, function (user) {
      return deepMatch(user, searchData);
    });
    return resolve(matchingItem);
  })
}

Code.getSnippet = function (language) {
  return Code.findOne({language: language});
}

Code.getLanguages = function () {
  return new Promise(function (resolve, reject) {
    return resolve(_.map(snippets, function (snippet) {
      return snippet.language;
    }));
  });
}

Code.seed = function (file) {
  var snippets = JSON.parse(readFile(file, 'utf8'));
  _.each(snippets, function (snippet) {
    new Code(snippet).save();
  });
}

module.exports = Code;
