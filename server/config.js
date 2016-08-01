var path = require('path');

var basedir = path.join(__dirname, '../');

var config = {
  app: {
    port: process.env.PORT || 8080,
    name: 'Deliberate Experiment'
  },
  path: function (p) {
    return path.join(basedir, p || '.');
  },
  session: {
    secret: process.env.SESSION_SECRET || 'supernova',
    saveUninitialized: true,
    resave: true
  },
};

config.auth = {
  saltFactor: 10,
  localstrategy: {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || 'foo',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'bar',
    callbackURL: 'http://experiment.tjenwellens.eu:' + config.app.port + '/login/twitter/return',
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || 'foo',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'bar',
    callbackURL: 'http://experiment.tjenwellens.eu:' + config.app.port + '/login/google/return',
  },
};

// todo: get into static/js/experiment.js
config.experiment = {
  showSnippet: {time: '3:00', seconds: 3 * 60},
  inputSnippet: {time: '2:00', seconds: 2 * 60},
};

module.exports = config;
