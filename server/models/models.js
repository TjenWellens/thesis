var mongoose = require('mongoose');

var User = require('./user')(mongoose);
var Code = require('./code')(mongoose);
var Experiment = require('./experiment')(mongoose);
var Contact = require('./contact')(mongoose);

module.exports = {
  user: User,
  code: Code,
  experiment: Experiment,
  contact: Contact,
};
