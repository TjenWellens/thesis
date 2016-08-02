module.exports = function (mongoose) {
  var schema = new mongoose.Schema({
    user: {
      id: String,
      name: String
    },
    data: [mongoose.Schema.Types.Mixed],
  }, {strict: false});

  return mongoose.model('Experiment', schema);
}
