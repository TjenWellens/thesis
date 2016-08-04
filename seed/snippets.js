var _ = require('underscore');
var path = require('path');
var readFile = require('../util/read-file');
var lineReader = require('readline');

function fromJsonFile () {
  var languageSettings = JSON.parse(readFile(path.join(__dirname, 'languages.json')));
  return _.map(languageSettings, function (languageSetting) {
    var file = path.join(__dirname, 'snippets', languageSetting.file);
    var fileContents = readFile(file);
    var code = fileContents ? fileContents.split('\n') : [];

    return {
      language: languageSetting.name,
      title: languageSetting.title,
      code: code,
    }
  });
}

module.exports = fromJsonFile