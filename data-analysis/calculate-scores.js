var whitespace = /\s/g;

var map = {
  since: {
    EMPTY: -1,
    '1w': 8,
    '1m': 7,
    '6m': 6,
    '1y': 5,
    '2y': 4,
    '3y': 3,
    '10y': 2,
    '10+y': 1,
    'never': 0,
  },
  experience: {
    EMPTY: -1,
    never: 0,
    student: 1,
    '0-1': 2,
    '1': 3,
    '2': 4,
    '3': 5,
    '4-10': 6,
    '10+': 7,
  },
  education: {
    EMPTY: -1,
    none: 0,
    student: 1,
    highschool: 2,
    college: 3,
    university: 4,
    phd: 5,
  },
  lastweek: {
    EMPTY: -1,
    '0': 0,
    '1-9': 1,
    '10-19': 2,
    '20-29': 3,
    '30-39': 4,
    '40+': 5,
  }
};

var code = db.codes.findOne({language: 'miner'}).code;
var codeNonWhiteCharacters = code.join('').replace(whitespace, '').length
print('code nonWhiteCharacters: ' + codeNonWhiteCharacters);
print('code lines: ' + code.length);

db.bcp.drop();
db.experiments.copyTo("bcp");

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
    var element = code[i];

    if (i >= row.code.length) {
      continue;
    }

    // exact
    if (row.code[i] === element) {
      scores.exact++;
    }

    // ignoreWhitespace
    var expectedLine = element.replace(whitespace, '');
    var actualLine = row.code[i].replace(whitespace, '');
    if (expectedLine === actualLine) {
      scores.ignoreWhitespace++;
    }

    // ignore order
    var index = codeNoOrder.indexOf(element);
    if (index >= 0) {
      scores.ignoreOrder++;
      codeNoOrder[index] = null;
    }

    // ignore order + whitespace
    var index = codeNoOrderNoWhitespace.indexOf(expectedLine);
    if (index >= 0) {
      scores.ignoreOrderWhitespace++;
      codeNoOrderNoWhitespace[index] = null;
    }
  }
  return scores;
}

function mapQuestions (row) {
// map questions
  var questions = {
    since: map.since[row.data.since],
    experience: map.experience[row.data.experience],
    education: map.education[row.data.education],
    lastweek: map.lastweek[row.data.lastWeek]
  };
  return questions;
}

db.bcp.find().forEach(function (row) {
  var nonWhiteCharacters = row.data.codeInput.replace(whitespace, '').length

  // calc scores
  var scores = calcScore(row);

  var questions = mapQuestions(row);

  // update in db
  db.bcp.update(
    {_id: row._id},
    {
      '$set': {
        scores: scores,
        questions: questions,
        nonWhiteCharacters: nonWhiteCharacters
      }
    }
  );
});