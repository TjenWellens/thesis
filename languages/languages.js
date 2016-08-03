var _ = require('underscore');
var path = require('path');
var readFile = require('../util/read-file');
var lineReader = require('readline');

function fromJsonFile() {
  var languageSettings = JSON.parse(readFile(path.join(__dirname, 'languages.json')));
  _.map(languageSettings, function (languageSetting) {
    var title = languageSetting.title;
    var name = languageSetting.name;
    var file = path.join(__dirname, name + '.txt');
    var code = readCodeLines(file);

    return {
      language: name,
      title: title,
      code: code,
    }
  });
}

function readCodeLines (file) {
  var all = readFile(file);
  console.log(all);
  return [];
}

module.exports = fromJsonFile

fromJsonFile();