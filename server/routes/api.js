module.exports = function (app, config, model) {
  var Code = model.code;

  app.get('/api/code/:languageId', function (req, res, next) {
    var language = req.params.languageId;
    if (!language) next('Internal error: cannot read params');

    Code.getSnippet(language)
      .then(function (snippet) {
        if (!snippet) res.status(404).send('404 Language not found');
        else res.json(snippet);
      })
      .catch(next);
  });

  app.get('/api/code', function (req, res, next) {
    Code.getLanguages()
      .then(function (languages) {
        res.json(languages);
      })
      .catch(next);
  });
};
