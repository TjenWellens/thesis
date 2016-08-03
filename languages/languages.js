var _ = require('underscore');
var path = require('path');
var readFile = require('../util/read-file');
var lineReader = require('readline');

function fromJsonFile () {
  var languageSettings = JSON.parse(readFile(path.join(__dirname, 'languages.json')));
  return _.map(languageSettings, function (languageSetting) {
    var title = languageSetting.title;
    var name = languageSetting.name;
    var file = path.join(__dirname, name + '.txt');
    var fileContents = readFile(file);
    var code = fileContents ? fileContents.split('\n') : [];

    return {
      language: name,
      title: title,
      code: code,
    }
  });
}

module.exports = fromJsonFile