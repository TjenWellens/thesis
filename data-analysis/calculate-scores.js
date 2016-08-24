var code = db.codes.findOne({language: 'miner'}).code;

var map = {
  since: {},
  experience: {},
  education: {
    EMPTY: -1,
    none: 0,
    student: 1,
    highschool: 2,
    college: 3,
    university: 4,
    phd: 5,
  },
  lastweek: {}
};

var whitespace = /\s/g;

var cursor = db.experiments.find();

print('working');

db.experiments.find().forEach(function (row) {
  var nonWhiteCharacters = row.data.codeInput.replace(whitespace, '').length

  // calc scores
  var scores = {
    exact: 0,
    ignoreWhitespace: 0,
    ignoreOrder: 0,
    ignoreOrderWhitespace: 0
  };

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
  }

  // map questions
  var questions = {
    since: map.since[row.data.since],
    experience: map.experience[row.data.experience],
    education: map.education[row.data.education],
    lastweek: map.lastweek[row.data.lastWeek]
  };

  // update in db
  db.experiments.update(
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