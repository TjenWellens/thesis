var _ = require('underscore');

var users = [];

function User (userData) {
  _.extend(this, userData);
}

User._all = users;

User.prototype.save = function () {
  var user = this;
  return new Promise(function (resolve, reject) {
    user._id = users.length;
    users.push(user);
    resolve(user);
  });
}

User.prototype.__defineGetter__('id', function () {
  return '' + this._id;
});

User.findOne = function (userData) {
  return new Promise(function (resolve, reject) {
    var matchingItem = _.find(users, function (user) {
      return deepMatch(user, userData);
    });
    return resolve(matchingItem);
  })

  function deepMatch (source, subset) {
    for (var prop in subset) {
      // source must contain all properties subset contains
      if (!(prop in source))
        return false;

      // property is object -> recurse
      if (typeof subset[prop] === 'object') {
        if (!deepMatch(source[prop], subset[prop]))
          return false;
      }
      // property is not object -> must be equal
      else if (source[prop] !== subset[prop])
        return false;
    }
    return true;
  }
}

User.findById = function (id, done) {
  if (id >= users.length) return done('User does not exist');
  done(null, users[id]);
}

module.exports = User;
