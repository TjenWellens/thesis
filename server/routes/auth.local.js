var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, config, model) {
  var User = model.user;

  var localStrategy = new LocalStrategy(config.auth.localstrategy,
    function (req, email, password, done) {
      if (!email)return done(null, false, req.flash('login', 'Email required'));
      if (!password) return done(null, false, req.flash('login', 'Password required'));

      User.findOne({email: email})
        .then(failIfUserDoesNotExists)
        .then(comparePassword)
        .then(success)
        .catch(doneIfError);

      //region Helper Functions
      function failIfUserDoesNotExists (user) {
        if (!user) {
          done(null, false, req.flash('signup', 'That email does not exist'));
          return Promise.reject(null);
        }
        return user;
      }

      function comparePassword (user) {
        if (!user.comparePassword(password)) {
          done(null, false, req.flash('login', 'Incorrect password.'));
          return Promise.reject(null);
        }
        return user;
      }

      function success (user) {
        done(null, user);
      }

      function doneIfError (err) {
        if (err) done(err);
      };
      //endregion
    });

  var localSignup = new LocalStrategy(config.auth.localstrategy,
    function (req, email, password, done) {
      if (!email)return done(null, false, req.flash('signup', 'Email required'));
      if (!password) return done(null, false, req.flash('signup', 'Password required'));

      User.findOne({email: email})
        .then(failIfUserExists)
        .then(createNewUserFromReqBody)
        .then(hashPassword)
        .then(save)
        .then(success)
        .catch(doneIfError);

      //region Helper Functions
      function hashPassword (user) {
        return user.hashPassword();
      }

      function save (user) {
        return user.save();
      }

      function success (user) {
        done(null, user);
      }

      function createNewUserFromReqBody () {
        return new User({
          name: req.body.name,
          email: email,
          password: password,
          registeredOn: new Date(),
        });
      }

      function failIfUserExists (user) {
        if (user) {
          done(null, false, req.flash('signup', 'That email is already taken.'));
          return Promise.reject(null);
        }
      }

      function doneIfError (err) {
        if (err) done(err);
      };
      //endregion
    });

  passport.use(localStrategy);
  passport.use('local-signup', localSignup);

  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/signup',
      failureFlash: true
    })
  );

  app.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );
};
