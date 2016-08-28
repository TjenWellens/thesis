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

config.questions = {};

config.questions.mapKeys = {
  since: 'since',
  experience: 'experience',
  education: 'education',
  lastWeek: 'lastweek',
}

config.questions.mapValues = {
  since: {
    EMPTY: -1,
    '1w': 8,
    '1m': 7,
    '6m': 6,
    '1y': 5,
    '2y': 4,
    '3y': 3,
    '10y': 2,
    '10+y': 1,
    'never': 0,
  },
  experience: {
    EMPTY: -1,
    never: 0,
    student: 1,
    '0-1': 2,
    '1': 3,
    '2': 4,
    '3': 5,
    '4-10': 6,
    '10+': 7,
  },
  education: {
    EMPTY: -1,
    none: 0,
    student: 1,
    highschool: 2,
    college: 3,
    university: 4,
    phd: 5,
  },
  lastWeek: {
    EMPTY: -1,
    '0': 0,
    '1-9': 1,
    '10-19': 2,
    '20-29': 3,
    '30-39': 4,
    '40+': 5,
  }
};

module.exports = config;
