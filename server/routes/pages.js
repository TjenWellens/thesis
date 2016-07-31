var _ = require('underscore');
var auth = require('../middleware/auth-redirect-login');

var standardPages = [
  {view: 'about', title: 'About'},
  {view: 'contact', title: 'Contact'},
  {view: 'login', title: 'Login'},
  {view: 'signup', title: 'Sign up'},
];

module.exports = function (app, config, model) {
  var Code = model.code;
  var Experiment = model.experiment;

  app.get('/', redirectTo('/about'));

  app.get('/experiment', auth, function (req, res, done) {

    Code.getLanguages()
      .then(function (languages) {
        res.render('experiment', {
          page: 'experiment',
          title: 'Deliberate Practice Experiment',
          message: req.flash('experiment'),
          languages: languages || [],
          showSnippetTime: '3:00',
          inputSnippetTime: '2:00',
        });
      })
      .catch(done);
  });

  app.post('/experiment', function (req, res, done) {
    var userData = {};
    if (req.user)
      userData = {id: req.user.id};
    else if (config.tryHardToMatchUnauthorizedUsers){
      // try to get as much info as possible, so I can
      userData = {
        notLoggedIn: true,
        ip: req.ip,
        headers: req.headers,
        ua: req.headers && req.headers['user-agent'],
        xff: req.headers && req.headers['x-forwarded-for'],
        cra: req.connection && req.connection.remoteAddress,
        sra: req.socket && req.socket.remoteAddress,
        csra: req.connection && req.connection.socket && req.connection.socket.remoteAddress,
      };
    }

    new Experiment(_.extend({}, req.body, {user: userData}))
      .save()
      .then(function () {
        res.redirect('/user/experiment');
      })
      .catch(done);
  });

  app.get('/user', auth, function (req, res, next) {
    console.log(req);
    var user = req.user;
    res.json(user);
  });

  app.get('/user/experiment', auth, function (req, res, next) {
    Experiment.findOne({user: {id: req.user.id}})
      .then(function (experiment) {
        res.json(experiment);
      })
      .catch(next);
  });

  _.each(standardPages, function (page) {
    app.get('/' + page.view, renderView(page));
  });
};

//region Helper Functions
function renderView (page) {
  return function (req, res) {
    res.render(page.view, {
      page: page.view,
      title: page.title,
      message: req.flash(page.view)
    });
  }
}

function redirectTo (path) {
  return function redirectExperiment (req, res) {
    res.redirect(path);
  }
}
//endregion
