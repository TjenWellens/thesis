var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var jwt = require('jsonwebtoken');

var config = require('../config');

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  registeredOn: Date
});

userSchema.methods.hashPassword = function() {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(config.auth.saltFactor), null);
  return this;
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.getToken = function() {
  return jwt.sign(user, config.auth.token.secret, {
    expiresIn: config.auth.token.expires
  });
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
