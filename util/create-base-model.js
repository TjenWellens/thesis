var _ = require('underscore');
var readFile = require('./read-file');
var mongoMatch = require('./mongo-match');

/**
 *
 * @param propertiesDefinition ignored
 * @param options ignored
 * @returns {Model}
 */
function createSchemaFactory() {
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

  Model.find = function (searchData) {
    return new Promise(function (resolve, reject) {
      var matchingItems = _.filter(Model._all, function (model) {
        return mongoMatch(model, searchData);
      });
      return resolve(matchingItems);
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

  // mongoose stuff
  Model.Types = {
    Mixed: 'Mixed'
  }

  return Model;
};

/**
 *
 * @param name ignored
 * @param schema schema from
 */
function convertSchemaToModel (name, schema) {

}

module.exports = {
  Schema: createSchemaFactory,
  model : convertSchemaToModel
};
