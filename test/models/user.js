var mongoose = require('../../util/fake-mongoose');

var User = new mongoose.Schema();

module.exports = mongoose.model('User', User);
