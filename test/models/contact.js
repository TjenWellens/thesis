var _ = require('underscore');
var mongoose = require('../../util/fake-mongoose');

var Contact = new mongoose.Schema();

module.exports = mongoose.model('Contact', Contact);
