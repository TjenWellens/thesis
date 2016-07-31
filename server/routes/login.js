var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

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
          done(null, false, req.flash('signup', 'That email is already taken.'));
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

  var twitterStrategy = new TwitterStrategy(
    config.auth.twitter,
    function (token, tokenSecret, profile, done) {
      var userData = {
        provider: 'twitter',
        twitter: {
          id: profile._json.id,
        }
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

  passport.use(localStrategy);
  passport.use('local-signup', localSignup);
  passport.use(twitterStrategy);

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, done);
  });

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

  app.get('/login/twitter',
    passport.authenticate('twitter'));

  app.get('/login/twitter/return',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  app.get('/user', function (req, res, next) {
    var user = req.user;
    res.json(user);
  });

  function sendToken (res, user) {
    // return the information including token as JSON
    res.json({
      success: true,
      message: 'Here is your token :)',
      token: user.getToken(),
      userId: user._id
    });
  }
};
