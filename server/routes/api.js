module.exports = function (app, config) {
  var languages = config.languages;

  app.get('/api/code/:languageId', function (req, res, next) {
    var languageId = req.params.languageId;
    if (!languageId) next('Internal error: cannot read params');

    var language = languages[languageId]
    if (!language) res.status(404).send('404 Language not found');

    res.send(language);
  });
}