var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, config, model) {
  var User = model.user;

  var localStrategy = new LocalStrategy(config.auth.localstrategy,
    function (req, email, password, done) {
      if (!email)return done(null, false, {message: 'Email required'});
      if (!password) return done(null, false, {message: 'Password required'});

      User.findOne({email: email}, function (err, user) {
        if (err)return done(err);
        if (!user)return done(null, false, {message: 'Incorrect email'});
        if (!user.comparePassword(password)) return done(null, false, {message: 'Incorrect password.'});

        return done(null, user);
      });
    });

  passport.use(localStrategy);

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, done);
  });

  app.post('/signup', function (req, res, next) {
    var userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      registeredOn: new Date(),
    };

    if (!userData.email) return next({status: 'error', code: 401, message: 'email required'});
    if (!userData.password) return next({status: 'error', code: 401, message: 'password required'});

    // check if user exists already
    User.findOne({email: userData.email}, function (err, existingUser) {
      if (err) return next(err);
      if (existingUser) return next({status: 'error', code: 401, message: 'Email address already used'});

      var user = new User(userData);
      user.hashPassword();
      user.save(function (err) {
        if (err) return next(err);

        req.login(user, function (err) {
          if (err) return next(err);
          return res.redirect('/');
        });
      });
    });
  });

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
