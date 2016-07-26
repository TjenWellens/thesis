var path = require('path');

var basedir = path.join(__dirname, '../');

module.exports = {
  app: {
    port: process.env.PORT || 8080,
    name: 'Deliberate Experiment'
  },
  path: function (p) {
    return path.join(basedir, p || '.');
  },
  languages: {
    'java': 'foo-java',
    'javascript': 'foo-javascript',
    'csharp': 'foo-c#',
    'c': 'foo-c',
  }
};
