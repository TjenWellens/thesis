var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var config = require('../config');

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  registeredOn: Date
});

userSchema.methods.hashPassword = function () {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(config.auth.saltFactor), null);
  return this;
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
