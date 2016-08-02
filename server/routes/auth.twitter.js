var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function (app, config, model) {
  var User = model.user;

  passport.use(createStrategy());

  app.get('/login/twitter',
    passport.authenticate('twitter'));

  app.get('/login/twitter/return',
    passport.authenticate('twitter', config.auth.login)
  );

  function createStrategy() {
    return new TwitterStrategy(
      config.auth.twitter,
      function (token, tokenSecret, profile, done) {
        var userData = {
          provider: 'twitter',
          'twitter.id': profile._json.id,
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
            provider: 'twitter',
            name: profile.displayName,
            twitter: {
              username: profile.username,
              id: profile._json.id,
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
