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
var pepper = 'foo';
var salt = 'bar';

function User (userData) {
  _.extend(this, userData, {token: users.length});
}

User.prototype.save = function () {
  var user = this;
  return new Promise(function (resolve, reject) {
    user.token = users.length;
    user._id = users.length;
    users.push(user);
    resolve(user);
  });
}

User.prototype.__defineGetter__('id', function () {
  return '' + this._id;
});

User.prototype.hashPassword = function () {
  this.password = pepper + this.password + salt;
  return this;
}

User.prototype.comparePassword = function (password) {
  return this.password === pepper + password + salt;
}

User.prototype.getToken = function () {
  return this.token;
}

User.findOne = function (userData) {
  return new Promise(function (resolve, reject) {
    _.find(users, function (user) {
      if (_.isMatch(user, userData)) {
        return resolve(user);
      }
    });
    return resolve(null);
  })
}

User.findById = function (id, done) {
  if (id >= users.length) return done('User does not exist');
  done(null, users[id]);
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
