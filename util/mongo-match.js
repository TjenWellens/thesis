var _ = require('underscore');

module.exports = function mongoMatch (model, searchData) {
  for (var key in searchData) {
    var value = searchData[key];

    // handle dot notation
    var dotIndex = key.indexOf('.');
    if (dotIndex > 0) {
      var firstKey = key.substr(0, dotIndex);
      var leftovers = key.substr(dotIndex + 1);

      if (!(firstKey in model))
        return false;

      var leftoverSearchData = {};
      leftoverSearchData[leftovers] = searchData[key];
      if (!mongoMatch(model[firstKey], leftoverSearchData))
        return false;

      continue;
    }

    // handle basic cases
    if (!(key in model))
      return false;

    if (typeof value !== 'object') {
      if (value !== model[key])
        return false
    }
    else if (!_.isMatch(model[key], value))
      return false;
  }
  return true;
};
