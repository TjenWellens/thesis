module.exports = function (mongoose) {
  var schema = new mongoose.Schema({
    user: {
      id: String,
      name: String
    },
    name: String,
    email: String,
    title: String,
    message: String,
    body: mongoose.Schema.Types.Mixed,
  }, {strict: false});

  return mongoose.model('Contact', schema);
}
