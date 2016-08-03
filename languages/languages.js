var _ = require('underscore');
var path = require('path');
var readFile = require('../util/read-file');
var lineReader = require('readline');

function fromJsonFile () {
  var languageSettings = JSON.parse(readFile(path.join(__dirname, 'languages.json')));
  _.map(languageSettings, function (languageSetting) {
    var title = languageSetting.title;
    var name = languageSetting.name;
    var file = path.join(__dirname, name + '.txt');
    var code = readFile(file).split('\n');

    return {
      language: name,
      title: title,
      code: code,
    }
  });
}

module.exports = fromJsonFile