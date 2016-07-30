var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, config, model) {
  var User = model.user;

  var localStrategy = new LocalStrategy(config.auth.localstrategy,
    function (req, email, password, done) {
      if (!email)return done(null, false, req.flash('loginMessage', 'Email required'));
      if (!password) return done(null, false, req.flash('loginMessage', 'Password required'));

      User.findOne({email: email})
        .then(function (user) {
          if (!user)return done(null, false, req.flash('loginMessage', 'Incorrect email'));
          if (!user.comparePassword(password)) return done(null, false, req.flash('loginMessage', 'Incorrect password.'));

          done(null, user);
        })
        .catch(done);
    });

  var localSignup = new LocalStrategy(config.auth.localstrategy,
    function (req, email, password, done) {
      if (!email)return done(null, false, req.flash('signupMessage', 'Email required'));
      if (!password) return done(null, false, req.flash('signupMessage', 'Password required'));

      User.findOne({email: email})
        .then(function (user) {
          if (user) return Promise.reject(false);

          return new User({
            name: req.body.name,
            email: email,
            password: password,
            registeredOn: new Date(),
          });
        })
        .then(function (user) {
          return user.hashPassword();
        })
        .then(function (user) {
          return user.save();
        })
        .then(function (user) {
          done(null, user);
        })
        .catch(function (err) {
          if(err) done(err);
          else done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        });
    });

  passport.use(localStrategy);
  passport.use('local-signup', localSignup);

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
