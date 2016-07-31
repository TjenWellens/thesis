var path = require('path');

var User = require('../test/models/user');
var Code = require('../test/models/code');

Code.seed(path.join(__dirname, 'models', 'languages.json'));

module.exports = {
  user: User,
  code: Code
};
