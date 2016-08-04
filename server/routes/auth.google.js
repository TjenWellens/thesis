var _ = require('underscore');
var passport = require('passport');
var Strategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (app, config, model) {
  var User = model.user;

  passport.use(createStrategy());

  app.get('/login/google',
    passport.authenticate('google', {scope: []}));

  app.get('/login/google/return',
    passport.authenticate('google', config.auth.login));

  function createStrategy () {
    return new Strategy(
      config.auth.google,
      function (token, tokenSecret, profile, done) {
        var userData = {
          provider: 'google',
          'google.id': profile.id,
        };

        User.findOne(userData)
          .then(successIfUserExists)
          .then(createNewUser)
          .then(save)
          .then(success)
          .catch(doneIfError);

        //region Helper Functions
        function save (user) {
          return user.save();
        }

        function success (user) {
          done(null, user);
        }

        function createNewUser () {
          return new User({
            provider: 'google',
            name: profile.displayName,
            google: {
              id: profile.id,
            }
          });
        }

        function successIfUserExists (user) {
          if (user) {
            done(null, user);
            return Promise.reject(null);
          }
        }

        function doneIfError (err) {
          if (err) done(err);
        };
        //endregion
      });
  }
};
