var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

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

userSchema.methods.getToken = function () {
  return jwt.sign({
    _id: this._id
  }, config.auth.token.secret, {
    expiresIn: config.auth.token.expires
  });
};

userSchema.methods.getUserForToken = function (token, done) {
  if (!token) return done('No token provided');
  // decode token to get user._id
  jwt.verify(token, config.auth.token.secret, function (err, decoded) {
    if (err) return done(err);
    // get user with _id
    userSchema.findById(decoded._id, function (err, user) {
      if (err) return done(err);
      done(null, user);
    });
  });
};

module.exports = mongoose.model('User', userSchema);
