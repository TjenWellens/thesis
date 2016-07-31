module.exports = function deepMatch (source, subset) {
  for (var prop in subset) {
    // source must contain all properties subset contains
    if (!(prop in source))
      return false;

    // property is object -> recurse
    if (typeof subset[prop] === 'object') {
      if (!deepMatch(source[prop], subset[prop]))
        return false;
    }
    // property is not object -> must be equal
    else if (source[prop] !== subset[prop])
      return false;
  }
  return true;
};