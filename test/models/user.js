var mongoose = require('../../util/fake-mongoose');

var schema = new mongoose.Schema();

module.exports = mongoose.model('User', schema);
