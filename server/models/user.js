module.exports = function (mongoose) {
  var schema = new mongoose.Schema({
    provider: String,
    name: String,
    registeredOn: {type: Date, default: Date.now},
    local: {
      email: String,
      password: String,
    },
    google: {
      id: String,
      email: String,
    },
    twitter: {
      username: String,
      id: String,
    },
  });

  return mongoose.model('User', schema);
}
