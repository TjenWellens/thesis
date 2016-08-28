var expect = require('chai').expect;
var config = require('../server/config');
var calculateScores = require('../util/calculate-scores')(config.score);

describe('calc-scores', function () {
  it('should calculate scores correctly', function () {
    var input = {
      expectedLines: [
        '   a',
        'x',
        'b',
        'b',
        'c',
      ],
      actualLines: [
        'a',
        'b',
        'c',
        'b',
        'b',
      ],
    }

    var expected = {
      exact: 1,
      ignoreWhitespace: 2,
      ignoreOrder: 3,
      ignoreOrderWhitespace: 4,
      nonWhiteCharacters: 5,
    };

    var actual = calculateScores(input.expectedLines, input.actualLines);
    expect(actual).to.eql(expected);
  })
});