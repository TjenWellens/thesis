var _ = require('underscore');
var path = require('path');
var readFile = require('../../util/read-file');

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

function seed (file) {
  var snippets = JSON.parse(readFile(file, 'utf8'));
  _.each(snippets, function (snippet) {
    new Code(snippet).save();
  });
}

seed(path.join(__dirname, 'languages.json'));

module.exports = Code;
