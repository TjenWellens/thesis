module.exports = function (app, config, model) {

  app.get('/api/code/:languageId', function (req, res, next) {
    var language = req.params.languageId;
    if (!language) next('Internal error: cannot read params');

    model.code.getSnippet(language, function (err, snippet) {
      if (err) res.status(404).send('404 Language not found');

      res.send(snippet);
    });
  });

  app.get('/api/code', function (req, res, next) {
    model.code.getLanguages(function (err, languages) {
      res.json(languages);
    })
  });
};
