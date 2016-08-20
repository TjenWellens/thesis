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
  home: '/about',
  loginSuccessRedirect: '/experiment',
};

config.auth = {
  saltFactor: 10,
  login: {
    successRedirect: config.loginSuccessRedirect,
    failureRedirect: '/login',
    failureFlash: true
  },
  signup: {
    successRedirect: config.loginSuccessRedirect,
    failureRedirect: '/signup',
    failureFlash: true
  },
  localstrategy: {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || 'foo',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'bar',
    callbackURL: 'http://experiment.tjenwellens.eu/login/twitter/return',
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || 'foo',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'bar',
    callbackURL: 'http://experiment.tjenwellens.eu/login/google/return',
  },
};

// todo: get into static/js/experiment.js
config.experiment = {
  showSnippet: {time: 'x:xx', seconds: 3 * 60},
  inputSnippet: {time: 'x:xx', seconds: 4 * 60},
  snippet: 'miner'
};

// also change on client!
function formatTime (seconds) {
  var minutes = ((seconds / 60) | 0);
  var seconds = ((seconds % 60) | 0);
  minutes = '' + minutes;
  seconds = seconds < 10 ? '0' + seconds : '' + seconds;
  return '' + minutes + ':' + seconds;
}

config.experiment.showSnippet.time = formatTime(config.experiment.showSnippet.seconds);
config.experiment.inputSnippet.time = formatTime(config.experiment.inputSnippet.seconds);

config.jsend = {
  errorMessages: {
    '404': 'Not Found',
    '401': 'Not Authenticated',
  }
}

config.database = {
  url: 'mongodb://localhost/experiment',
}

if (process.env.NODE_ENV == 'docker') {
  config.database.url = 'mongodb://db/experiment'
}

config.mail = {
  provider: 'smtp.gmail.com',
  email: process.env.MAIL_ADDRESS || 'user@gmail.com',
  password: process.env.MAIL_PASS || 'pass',
  defaultData: {
    from: '"' + config.app.name + '" <experiment@tjenwellens.eu>',
    to: 'tjen.wellens+thesis@gmail.com',
    subject: 'Hello',
    // plaintext body
    text: 'Hello world',
    // html body
    html: '<b>Hello world</b>'
  }
}

module.exports = config;
