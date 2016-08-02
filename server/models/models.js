var _ = require('underscore');
var path = require('path');

var User = require('./user');
var Code = require('../../test/models/code');
var Experiment = require('../../test/models/experiment');
var Contact = require('../../test/models/contact');

Code.seed(path.join(__dirname, '../../test/models/','languages.json'));

// calculate extra properties
_.each(Code._all, function (snippet) {
  snippet.calculatExtraProperties();
});

module.exports = {
  user: User,
  code: Code,
  experiment: Experiment,
  contact: Contact,
};
