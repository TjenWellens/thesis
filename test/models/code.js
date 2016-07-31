var _ = require('underscore');

var languages = {
  'java': 'foo-java',
  'javascript': 'foo-javascript',
  'csharp': 'foo-c#',
  'c': 'foo-c',
};

function getSnippet (language, callback) {
  var snippet = languages[language];

  if (!snippet) return callback('Unknown language: ' + language);

  return callback(null, snippet);
}

function getLanguages (callback) {
  return callback(null, _.keys(languages));
}

module.exports = {
  getSnippet: getSnippet,
  getLanguages: getLanguages
}
