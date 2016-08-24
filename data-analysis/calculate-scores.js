var Code = db.codes;
var Experiment = db.experiments;

var code = Code.findOne({language: 'miner'}).code;

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

Experiment.find().forEach(function (row) {

  // calc scores
  var scores = {
    exact: 0,
    ignoreWhitespace: 0,
    ignoreOrder: 0,
    ignoreOrderWhitespace: 0,
  };

  // exact
  expected.forEach(function (element, index, array) {
    if (index >= row.code.length) return;
    if (row.code[index] !== element) return;

    scores.exact++;
  });

  var whitespace = / /g;
  // ignoreWhitespace
  expected.forEach(function (element, index, array) {
    if (index >= row.code.length) return;


    var expectedLine = element.replace(whitespace, '');
    var actualLine = row.code[index].replace(whitespace, '');
    if (expectedLine !== actualLine) return;

    scores.ignoreWhitespace++;
  });

  // map questions
  var questions = {
    since: map.since[row.data.since],
    experience: map.experience[row.data.experience],
    education: map.education[row.data.education],
    lastweek: map.lastweek[row.data.lastWeek],
  };

  // update in db
  Experiment.update(
    {_id: row._id},
    {
      '$set': {
        scores: scores,
        questions: questions
      }
    }
  );
});