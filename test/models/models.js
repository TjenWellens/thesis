var _ = require('underscore');
var path = require('path');

var User = require('./user');
var Code = require('./code');

Code.seed(path.join(__dirname, 'languages.json'));

// calculate extra properties
_.each(Code._all, function (snippet) {
  snippet.calculatExtraProperties();
});

module.exports = {
  user: User,
  code: Code
};
