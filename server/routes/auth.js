var passport = require('passport');
var auth = require('../middleware/auth-redirect-login');

module.exports = function (app, config, model) {
  var User = model.user;

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, done);
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect(config.home);
  });

  app.get('/user', auth, showUserData);

  function showUserData (req, res, next) {
    var user = req.user;
    res.jsend.success(user);
  }
};
