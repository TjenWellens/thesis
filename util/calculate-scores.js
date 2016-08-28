module.exports = function (options) {
  var whitespace = options.whitespace;

  return function (expectedLines, actualLines) {
    var scores = {
      exact: 0,
      ignoreWhitespace: 0,
      ignoreOrder: 0,
      ignoreOrderWhitespace: 0,
      nonWhiteCharacters: 0,
    };

    // score: characters
    scores.nonWhiteCharacters = actualLines.join('').replace(whitespace, '').length;

    var codeNoOrder = [];
    var codeNoOrderNoWhitespace = [];

    // add lines without whitespace
    for (var i = 0; i < actualLines.length; i++) {
      codeNoOrder[i] = actualLines[i];
      codeNoOrderNoWhitespace[i] = actualLines[i].replace(whitespace, '');
    }

    for (var i = 0; i < expectedLines.length; i++) {
      var element = expectedLines[i];

      if (i >= actualLines.length) {
        continue;
      }

      // score: exact
      if (actualLines[i] === element) {
        scores.exact++;
      }

      // score: ignoreWhitespace
      var expectedLine = element.replace(whitespace, '');
      var actualLine = actualLines[i].replace(whitespace, '');
      if (expectedLine === actualLine) {
        scores.ignoreWhitespace++;
      }

      // score: ignore order
      var index = codeNoOrder.indexOf(element);
      if (index >= 0) {
        scores.ignoreOrder++;
        codeNoOrder[index] = null;
      }

      // score: ignore order + whitespace
      var index = codeNoOrderNoWhitespace.indexOf(expectedLine);
      if (index >= 0) {
        scores.ignoreOrderWhitespace++;
        codeNoOrderNoWhitespace[index] = null;
      }
    }
    return scores;
  }
}