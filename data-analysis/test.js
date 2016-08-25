var code = [
  "   a",
  "x",
  "b",
  "b",
  "c",
];

var actual = [
  "a",
  "b",
  "b",
  "b",
];

var whitespace = /\s/g;

function calcScore (row) {
  var scores = {
    exact: 0,
    ignoreWhitespace: 0,
    ignoreOrder: 0,
    ignoreOrderWhitespace: 0
  };
  var codeNoOrder = [];
  var codeNoOrderNoWhitespace = [];

  // add lines without whitespace
  for (var i = 0; i < row.code.length; i++) {
    codeNoOrder[i] = row.code[i];
    codeNoOrderNoWhitespace[i] = row.code[i].replace(whitespace, '');
  }

  for (var i = 0; i < code.length; i++) {
    var expectedLine = code[i];
    var expectedLineNoWhitespace = expectedLine.replace(whitespace, '');
    var actualLine = row.code[i];
    var actualLineNoWhitespace = actualLine.replace(whitespace, '');

    if (i >= row.code.length) {
      continue;
    }

    // exact
    if (actualLine === expectedLine) {
      scores.exact++;
    }

    // ignoreWhitespace
    if (expectedLineNoWhitespace === actualLineNoWhitespace) {
      scores.ignoreWhitespace++;
    }

    // ignore order
    var index = codeNoOrder.indexOf(expectedLine);
    if (index >= 0) {
      scores.ignoreOrder++;
      codeNoOrder[index] = null;
    }

    // ignore order + whitespace
    var index = codeNoOrderNoWhitespace.indexOf(expectedLineNoWhitespace);
    if (index >= 0) {
      scores.ignoreOrderWhitespace++;
      codeNoOrderNoWhitespace[index] = null;
    }
  }
  return scores;
}

console.log(calcScore({code:actual}));