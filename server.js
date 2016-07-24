var config = require('./server/config');
var app = require('./server/app')(config);

// Start server
app.listen(config.app.port, function () {
  console.log('--' + config.app.name + ' API available on port ' + config.app.port);
});
