var _ = require('underscore');
var readFile = require('./read-file');
var mongoMatch = require('./mongo-match');

/**
 *
 * @param propertiesDefinition ignored
 * @param options ignored
 * @returns {Model}
 */
function Schema (propertiesDefinition, options) {
  this.methods = {};
  this.statics = {};
  this._preHooks = {};

  this.pre = function (eventName, callback) {
    var hooks = this._preHooks[eventName];

    if (!hooks) {
      hooks = [];
      this._preHooks[eventName] = hooks;
    }

    hooks.push(callback);
  };
}

Schema.Types = {
  Mixed: 'Mixed'
};

/**
 *
 * @param name ignored
 * @param schema
 */
function convertSchemaToModel (name, schema) {
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
      _.each(Model._preHooks['save'], function (hook) {
        hook.call(model, doNothing);
      });

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

  // add methods
  for (var key in schema.methods) {
    Model.prototype[key] = schema.methods[key];
  }

  // add statics
  for (var key in schema.statics) {
    Model[key] = schema.statics[key];
  }

  // add pre hooks
  Model._preHooks = schema._preHooks;

  return Model;
};

function doNothing () {
}

module.exports = {
  Schema: Schema,
  model: convertSchemaToModel
};
