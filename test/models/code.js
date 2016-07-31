var _ = require('underscore');
var path = require('path');
var readFile = require('../../util/read-file');

var LANGUAGES = JSON.parse(readFile(path.join(__dirname, 'languages.json'), 'utf8'));

var snippets = [];

function Code (data) {
  _.extend(this, data);
}

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
    var matchingItem = _.find(LANGUAGES, function (user) {
      return deepMatch(user, searchData);
    });
    return resolve(matchingItem);
  })

  function deepMatch (source, subset) {
    for (var prop in subset) {
      // source must contain all properties subset contains
      if (!(prop in source))
        return false;

      // property is object -> recurse
      if (typeof subset[prop] === 'object') {
        if (!deepMatch(source[prop], subset[prop]))
          return false;
      }
      // property is not object -> must be equal
      else if (source[prop] !== subset[prop])
        return false;
    }
    return true;
  }
}

Code._all = snippets;

Code.getSnippet = function (language) {
  return Code.findOne({language: language});
}

Code.getLanguages = function () {
  return new Promise(function (resolve, reject) {
    return resolve(_.map(LANGUAGES, function (snippet) {
      return snippet.language;
    }));
  });
}

module.exports = Code;
