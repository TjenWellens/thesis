var _ = require('underscore');
var auth = require('../middleware/auth-redirect-login');

module.exports = function (app, config, model) {
  var Code = model.code;
  var Experiment = model.experiment;
  var User = model.user;

  app.get('/experiment', auth, experiment);

  app.post('/experiment', auth, saveExperimentData);

  app.get('/experiment/result', auth, showExperimentData);

  app.post('/experiment/followup', auth, saveFollowup);

  function showExperimentData (req, res, next) {
    if (!req.user.id) return next('Authentication problem');

    var data = {
      home: config.home,
      page: 'result',
      title: 'Results',
      message: req.flash('result'),
      askForFollowUp: null,
      loggedIn: null,
      email: null,
      expected: null,
      actual: null,
    };

    data.askForFollowUp = !req.user.followup.email;
    data.loggedIn = !!req.user;
    data.email = req.user.getEmail();

    Experiment.findOne({'user.id': req.user.id}, {}, {sort: {'date': -1}})
      .then(function (experiment) {
        if (!experiment) return Promise.reject('No experiment has been done');

        data.actual = {code: experiment.code};

        return Code.findOne({_id: experiment.data.snippetId});
      })
      .then(function (snippet) {
        if (!snippet) return Promise.reject('Original snippet does not exist');

        data.expected = {code: snippet.code};
      })
      .then(function () {
        res.render('result', data);
      })
      .catch(next);
  }

  function experiment (req, res, done) {
    Code.getSnippet(config.experiment.snippet)
      .then(function (snippet) {
        if (!snippet) return Promise.reject('snippet not found');
        res.render('experiment', {
          home: config.home,
          page: 'experiment',
          title: 'Deliberate Practice Experiment',
          message: req.flash('experiment'),
          loggedIn: req.user ? true : false,
          snippet: {
            code: snippet.code,
            id: snippet.id,
            rows: snippet.rows + 2,
            cols: snippet.cols + 2,
          },
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
      code: req.body.codeInput.replace(new RegExp('\r', 'g'), '').split('\n'),
    }

    new Experiment(data)
      .save()
      .then(function () {
        res.redirect('/experiment/result');
      })
      .catch(done);
  }

  function saveFollowup (req, res, done) {
    User.findOne({_id: req.user.id})
      .then(function (user) {
        if (!req.body.email) return Promise.reject('Empty email');
        user.followup = {
          email: req.body.email,
          date: new Date().toISOString(),
          data: req.body,
        }
        return user.save();
      })
      .then(function () {
        res.redirect('/experiment/result');
      })
      .catch(done);
  }
};
