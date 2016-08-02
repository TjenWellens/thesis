var mongoose = require('mongoose');

require('dotenv').config();

var config = require('./server/config');
var model = require('./server/models/models')(mongoose);
var app = require('./server/app')(config, model);

// connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.database.url)
  .then(function () {
    console.log('---Connected to db ' + config.database.url);
  })
  .catch(function (err) {
    throw err;
  });

// Start server
app.listen(config.app.port, function () {
  console.log('--' + config.app.name + ' API available on port ' + config.app.port);
});
