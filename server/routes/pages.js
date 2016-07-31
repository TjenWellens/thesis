var _ = require('underscore');

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

  app.get('/experiment', function (req, res, done) {

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
    new Experiment(_.extend({}, req.body, {userId: req.user.id}))
      .save()
      .then(function () {
        res.redirect('/user/experiment');
      })
      .catch(done);
  });

  app.get('/user', function (req, res, next) {
    var user = req.user;
    res.json(user);
  });

  app.get('/user/experiment', function (req, res, next) {
    Experiment.findOne({userId: req.user.id})
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
