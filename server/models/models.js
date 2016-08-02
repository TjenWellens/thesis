module.exports = function (mongoose) {
  return {
    user: require('./user')(mongoose),
    code: require('./code')(mongoose),
    experiment: require('./experiment')(mongoose),
    contact: require('./contact')(mongoose),
  };
};
