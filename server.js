require('dotenv').config();

var config = require('./server/config');
var model = require('./server/models/models');
var app = require('./server/app')(config, model);

// Start server
app.listen(config.app.port, function () {
  console.log('--' + config.app.name + ' API available on port ' + config.app.port);
});
