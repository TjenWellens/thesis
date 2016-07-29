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
  auth: {
    saltFactor: 10,
    token: {
      secret: process.env.TOKEN_SECRET || 'beepandboopandboopandbeep',
      expires: 1440 // expires in 24 hours
    }
  }
};
