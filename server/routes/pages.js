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

  app.get('/', redirectTo(config.home));

  // standard pages
  _.each(standardPages, function (page) {
    app.get('/' + page.view, renderView(page));
  });

  app.get('/experiment', auth, experiment);

  app.post('/experiment', auth, saveExperimentData);

  app.get('/user', auth, showUserData);

  app.get('/user/experiment', auth, showExperimentData);

  //region routes
  function showExperimentData (req, res, next) {
    Experiment.findOne({user: {id: req.user.id}})
      .then(function (experiment) {
        res.jsend.success(experiment);
      })
      .catch(next);
  }

  function showUserData (req, res, next) {
    var user = req.user;
    res.jsend.success(user);
  }

  function experiment (req, res, done) {
    Code.getLanguages()
      .then(function (languages) {
        res.render('experiment', {
          home: config.home,
          page: 'experiment',
          title: 'Deliberate Practice Experiment',
          message: req.flash('experiment'),
          languages: languages || [],
          showSnippetTime: config.experiment.showSnippet.time,
          inputSnippetTime: config.experiment.inputSnippet.time,
        });
      })
      .catch(done);
  }

  function saveExperimentData (req, res, done) {
    var userData = {id: req.user.id};

    new Experiment(_.extend({}, req.body, {user: userData}))
      .save()
      .then(function () {
        res.redirect('/user/experiment');
      })
      .catch(done);
  }

  //endregion

  //region Helper Functions
  function renderView (page) {
    return function (req, res) {
      res.render(page.view, {
        home: config.home,
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
};
