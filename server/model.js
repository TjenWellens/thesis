var _ = require('underscore');

var languages = {
  'java': 'foo-java',
  'javascript': 'foo-javascript',
  'csharp': 'foo-c#',
  'c': 'foo-c',
};

function getSnippet (language, callback) {
  var snippet = languages[language];

  if (!snippet) return callback('Unknown language: ' + language);

  return callback(null, snippet);
}

function getLanguages (callback) {
  return callback(null, _.keys(languages));
}

var users = [];

function User (userData) {
  _.extend(this, userData, {token: users.length});
}

User.prototype.save = function (callback) {
  this.token = users.length;
  users.push(this);
  callback(null);
}

User.prototype.hashPassword = function () {
  this.password = this.password + '1';
  return this;
}

User.prototype.comparePassword = function (password) {
  return password + '1' == this.password;
}

User.prototype.getToken = function () {
  return this.token;
}

User.findOne = function (userData, callback) {
  _.find(users, function (user) {
    if (_.isMatch(user, userData)) {
      return callback(null, user);
    }
  });
  return callback(null, null);
}

User.getUserForToken = function (token, done) {
  done(null, users[token]);
}

module.exports = {
  user: User,
  clearUsers: function () {
    users = [];
  },
  code: {
    getSnippet: getSnippet,
    getLanguages: getLanguages
  }
};
