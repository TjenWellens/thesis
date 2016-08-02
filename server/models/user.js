var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var config = require('../config');

var userSchema = new mongoose.Schema({
  provider: String,
  name: String,
  registeredOn: { type: Date, default: Date.now },
  local: {
    email: String,
    password: String,
  },
  google: {
    id: String,
    email: String,
  },
  twitter: {
    username: String,
    id: String,
  },
});

userSchema.methods.hashPassword = function () {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(config.auth.saltFactor), null);
  return this;
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
