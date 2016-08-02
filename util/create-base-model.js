var _ = require('underscore');
var readFile = require('./read-file');
var mongoMatch = require('./mongo-match');

module.exports = function () {
  function Model (data) {
    _.extend(this, data);
  }

  Model._all = [];

  Model.prototype.__defineGetter__('id', function () {
    return '' + this._id;
  });

  Model.prototype.save = function () {
    var model = this;
    return new Promise(function (resolve, reject) {
      model._id = Model._all.length;
      Model._all.push(model);
      resolve(model);
    });
  }

  Model.findOne = function (searchData) {
    return new Promise(function (resolve, reject) {
      var matchingItem = _.find(Model._all, function (model) {
        return mongoMatch(model, searchData);
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
    if (id >= Model._all.length) return done('Model does not exist');
    done(null, Model._all[id]);
  }

  return Model;
};
