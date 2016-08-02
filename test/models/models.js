var mongoose = require('../../util/fake-mongoose');
var path = require('path');
var seed = require('../../util/seed-database');

var models = require('../../server/models/models')(mongoose);

seed(models.code, path.join(__dirname, 'languages.json'));

module.exports = models;
