var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  user: {
    id: String,
    name: String
  },
  data: [mongoose.Schema.Types.Mixed],
}, {strict: false});

module.exports = mongoose.model('Experiment', schema);
