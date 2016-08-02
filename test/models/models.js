var mongoose = require('../../util/fake-mongoose');
var path = require('path');
var seed = require('../../util/seed-database');

var User = require('../../server/models/user')(mongoose);
var Code = require('../../server/models/code')(mongoose);
var Experiment = require('../../server/models/experiment')(mongoose);
var Contact = require('../../server/models/contact')(mongoose);

seed(Code, path.join(__dirname, 'languages.json'));

module.exports = {
  user: User,
  code: Code,
  experiment: Experiment,
  contact: Contact,
};
