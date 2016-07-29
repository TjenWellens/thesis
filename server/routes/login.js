module.exports = function (app, config, model) {
  var User = model.user;

  app.post('/signup', function (req, res, next) {
    var userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      registeredOn: new Date(),
    };

    // TODO: check if user exists already

    var user = new User(userData);
    user.hashPassword();
    user.save(function (err) {
      if (err) return next(err);
      sendToken(res, user);
    });
  });

  app.post('/login', function (req, res, next) {
    var userData = {
      email: req.body.email
    };

    User.findOne(userData, function (err, user) {
      if (err) return next(err);
      if (!user) return next('Login failed');
      if (!user.comparePassword(req.body.password)) return next('Login failed');

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
