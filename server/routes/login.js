module.exports = function (app, config, model) {
  var User = model.user;

  app.post('/signup', function (req, res, next) {
    var userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      registeredOn: new Date(),
    };

    if (!userData.email) return next({status: 'error', code: 401, message: 'email required'});
    if (!userData.email) return next({status: 'error', code: 401, message: 'password required'});

    // check if user exists already
    User.findOne({email: userData.email}, function (err, existingUser) {
      if (err) return next(err);
      if (existingUser) return next({status: 'error', code: 401, message: 'Email address already used'});

      var user = new User(userData);
      user.hashPassword();
      user.save(function (err) {
        if (err) return next(err);
        sendToken(res, user);
      });
    });
  });

  app.post('/login', function (req, res, next) {
    User.findOne({email: req.body.email}, function (err, user) {
      if (err) return next(err);
      if (!user) return next({status: 'error', code: 401, message: 'Login failed'});
      if (!user.comparePassword(req.body.password)) return next({status: 'error', code: 401, message: 'Login failed'});

      sendToken(res, user);
    });
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
