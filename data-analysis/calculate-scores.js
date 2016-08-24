use experiment;

var Code = db.codes;
var Experiment = db.experiments;

var code = Code.findOne({language: 'miner'}).code;

function calculateScores (expected, actual) {
  var scores = {
    exact: 0,
    ignoreWhitespace: 0,
    ignoreOrder: 0,
    ignoreOrderWhitespace: 0,
  };

  // exact
  expected.forEach(function (element, index, array) {
    if (index >= actual.length) return;
    if (actual[index] !== element) return;

    scores.exact++;
  });

  var whitespace = / /g;
  // ignoreWhitespace
  expected.forEach(function (element, index, array) {
    if (index >= actual.length) return;


    var expectedLine = element.replace(whitespace, '');
    var actualLine = actual[index].replace(whitespace, '');
    if (expectedLine !== actualLine) return;

    scores.ignoreWhitespace++;
  });

  return scores;
}

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
  lastweek: {},
};

function mapQuestions (data) {
  return {
    since: map.since[data.since],
    experience: map.experience[data.experience],
    education: map.education[data.education],
    lastweek: map.lastweek[data.lastWeek],
  };
}

function updateExperimentScores (row) {
  Experiment.update(
    {_id: row._id},
    {
      '$set': {
        scores: calculateScores(code, row.code),
        questions: mapQuestions(row.data)
      }
    }
  );
}

Experiment.find().forEach(updateExperimentScores);