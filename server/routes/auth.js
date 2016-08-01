var passport = require('passport');

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
    res.redirect('/');
  })
};
