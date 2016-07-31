var _ = require('underscore');

var standardPages = [
  {view: 'about', title: 'About'},
  {view: 'contact', title: 'Contact'},
  {view: 'login', title: 'Login'},
  {view: 'signup', title: 'Sign up'},
];

module.exports = function (app, config, model) {
  app.get('/', redirectTo('/about'));

  app.get('/experiment', function (req, res, done) {
    var Code = model.code;

    Code.getLanguages(function (err, languages) {
      if(err) return done(err);
      res.render('experiment', {
        page: 'experiment',
        title: 'Deliberate Practice Experiment',
        message: req.flash('experiment'),
        languages: languages || [],
        showSnippetTime: '3 minutes',
        inputSnippetTime: '2 minutes',
      });
    });
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
