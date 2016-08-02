var _ = require('underscore');
var mongoose = require('../../util/fake-mongoose');

var Experiment = new mongoose.Schema();

module.exports = mongoose.model('Experiment', Experiment);
