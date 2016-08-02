var _ = require('underscore');
var path = require('path');
var seed = require('../../util/seed-database');

var User = require('./user');
var Code = require('./code');
var Experiment = require('./experiment');
var Contact = require('./contact');

seed(Code, path.join(__dirname, 'languages.json'));

module.exports = {
  user: User,
  code: Code,
  experiment: Experiment,
  contact: Contact,
};
