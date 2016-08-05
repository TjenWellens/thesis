module.exports = function (mongoose) {
  var schema = new mongoose.Schema({
    provider: String,
    name: String,
    registeredOn: {type: Date, default: Date.now},
    followup: {
      email: String,
      date: {type: Date, default: Date.now},
    },
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
      email: String,
    },
  });

  schema.methods.getEmail = function () {
    if (this.local && this.local.email)
      return this.local.email;

    if (this.google && this.google.email)
      return this.google.email;

    if (this.twitter && this.twitter.email)
      return this.twitter.email;

    return '';
  }

  return mongoose.model('User', schema);
}
