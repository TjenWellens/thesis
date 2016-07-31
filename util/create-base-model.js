var _ = require('underscore');
var readFile = require('./read-file');
var deepMatch = require('./deep-match');

module.exports = function () {
  var all = [];

  function Model (data) {
    _.extend(this, data);
  }

  Model._all = all;

  Model.prototype.save = function () {
    var model = this;
    return new Promise(function (resolve, reject) {
      model._id = all.length;
      all.push(model);
      resolve(model);
    });
  }

  Model.findOne = function (searchData) {
    return new Promise(function (resolve, reject) {
      var matchingItem = _.find(all, function (model) {
        return deepMatch(model, searchData);
      });
      return resolve(matchingItem);
    })
  }

  Model.seed = function (file) {
    var seed = JSON.parse(readFile(file, 'utf8'));
    _.each(seed, function (data) {
      new Model(data).save();
    });
  }

  Model.findById = function (id, done) {
    if (id >= all.length) return done('Model does not exist');
    done(null, all[id]);
  }

  return Model;
};
