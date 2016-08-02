var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  user: {
    id: String,
    name: String
  },
  name: String,
  email: String,
  title: String,
  message: String,
  body: [mongoose.Schema.Types.Mixed],
}, {strict: false});

module.exports = mongoose.model('Contact', userSchema);
