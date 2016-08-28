module.exports = function (options) {
  var mapKeys = options.mapKeys;
  var mapValues = options.mapValues;

  return function (questionData) {
    var questions = {};

    for (var oldKey in mapKeys) {
      var newKey = mapKeys[oldKey];
      var oldValue = questionData[oldKey];
      var newValue = mapValues[oldKey][oldValue];
      questions[newKey] = newValue;
    }

    return questions;
  }
}