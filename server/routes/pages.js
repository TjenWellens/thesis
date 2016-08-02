var _ = require('underscore');

var standardPages = [
  {view: 'about', title: 'About'},
  {view: 'contact', title: 'Contact'},
  {view: 'login', title: 'Login'},
  {view: 'signup', title: 'Sign up'},
];

module.exports = function (app, config, model) {
  app.get('/', redirectTo(config.home));

  // standard pages
  _.each(standardPages, function (page) {
    app.get('/' + page.view, renderView(page));
  });

  function renderView (page) {
    return function (req, res) {
      res.render(page.view, {
        home: config.home,
        page: page.view,
        title: page.title,
        message: req.flash(page.view),
        loggedIn: req.user ? true : false,
      });
    }
  }

  function redirectTo (path) {
    return function redirectExperiment (req, res) {
      res.redirect(path);
    }
  }
};
