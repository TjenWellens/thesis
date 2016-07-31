var path = require('path');

var User = require('./user');
var Code = require('./code');

Code.seed(path.join(__dirname, 'languages.json'));

module.exports = {
  user: User,
  code: Code
};
