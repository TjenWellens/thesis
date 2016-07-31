var mongoose = require('mongoose');

var config = require('../config');

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  registeredOn: Date
});

module.exports = mongoose.model('User', userSchema);
