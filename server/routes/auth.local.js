var passport = require('passport');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, config, model) {
  var User = model.user;

  var util = {
    hashPassword: function (password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(config.auth.saltFactor), null);
    },
    comparePassword: function (password, hash) {
      return bcrypt.compareSync(password, hash);
    },
  }

  function createLoginStrategy () {
    return new LocalStrategy(config.auth.localstrategy,
      function (req, email, password, done) {
        if (!email)return done(null, false, req.flash('login', 'Email required'));
        if (!password) return done(null, false, req.flash('login', 'Password required'));

        var searchData = {
          provider: 'local',
          local: {
            email: email,
          }
        };

        User.findOne(searchData)
          .then(failIfUserDoesNotExists)
          .then(checkPassword)
          .then(success)
          .catch(doneIfError);

        //region Helper Functions
        function failIfUserDoesNotExists (user) {
          if (!user) {
            console.log('login failed: email does not exist')
            done(null, false, req.flash('signup', 'That email does not exist'));
            return Promise.reject(null);
          }
          return user;
        }

        function checkPassword (user) {
          if (!util.comparePassword(password, user.local.password)) {
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
  }

  function createSignupStrategy () {
    return new LocalStrategy(config.auth.localstrategy,
      function (req, email, password, done) {
        if (!email)return done(null, false, req.flash('signup', 'Email required'));
        if (!password) return done(null, false, req.flash('signup', 'Password required'));

        var searchData = {
          provider: 'local',
          local: {
            email: email,
          }
        };

        User.findOne(searchData)
          .then(failIfUserExists)
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
            provider: 'local',
            name: req.body.name,
            local: {
              email: email,
              password: util.hashPassword(password),
              registeredOn: new Date(),
            }
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
  }

  passport.use(createLoginStrategy());
  passport.use('local-signup', createSignupStrategy());

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
