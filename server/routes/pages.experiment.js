var _ = require('underscore');
var auth = require('../middleware/auth-redirect-login');

module.exports = function (app, config, model) {
  var Code = model.code;
  var Experiment = model.experiment;

  app.get('/experiment', auth, experiment);

  app.post('/experiment', auth, saveExperimentData);

  app.get('/user/experiment', auth, showExperimentData);

  function showExperimentData (req, res, next) {
    if (!req.user.id) return next('Authentication problem');

    Experiment.find({'user.id': req.user.id})
      .then(function (experiment) {
        res.jsend.success(experiment);
      })
      .catch(next);
  }

  function experiment (req, res, done) {
    Code.getLanguages()
      .then(function (languages) {
        res.render('experiment', {
          home: config.home,
          page: 'experiment',
          title: 'Deliberate Practice Experiment',
          message: req.flash('experiment'),
          loggedIn: req.user ? true : false,
          languages: languages || [],
          showSnippetTime: config.experiment.showSnippet.time,
          inputSnippetTime: config.experiment.inputSnippet.time,
        });
      })
      .catch(done);
  }

  function saveExperimentData (req, res, done) {
    var userData = {id: req.user.id, name: req.user.name};
    var data = {
      user: userData,
      data: _.extend({}, req.body),
    }

    new Experiment(data)
      .save()
      .then(function () {
        res.redirect('/user/experiment');
      })
      .catch(done);
  }
};
