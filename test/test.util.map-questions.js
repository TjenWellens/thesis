var expect = require('chai').expect;
var config = require('../server/config');
var mapQuestions = require('../util/map-questions')(config.questions);

describe('map-questions', function () {
  it('should map correctly', function () {
    var input = {
      'lastWeek' : '0',
      'education' : 'college',
      'experience' : '4-10',
      'since' : '1w'
    };
    var expected = {
      lastweek: 0,
      education: 3,
      experience: 6,
      since: 8,
    }

    var actual = mapQuestions(input);
    expect(actual).to.eql(expected);
  })
});