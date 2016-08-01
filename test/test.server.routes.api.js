var supertest = require('supertest');
var expect = require('chai').expect;
var _ = require('underscore');

var config = require('../server/config');
var model = require('./models/models');
var app = require('../server/app')(config, model);

var jsendOptions = _.extend({}, config.jsend, {expect: expect});
var jsend = require('../server/middleware/jsend')(jsendOptions);

var DATA = {
  languages: ['java', 'javascript', 'csharp', 'c'],
  javaSnippet: JSON.parse('{"_id": 0, "cols": 8, "rows": 1, "language": "java", "code": ["foo-java"]}')
};

describe('server routes api', function () {
  describe('/api/code', function () {
    it('should return a list of available languages', function (done) {
      supertest(app)
        .get('/api/code')
        .expect(200)
        .expect(jsend.succes(DATA.languages))
        .end(done);
    });

    it('/java should return html snippet', function (done) {
      supertest(app)
        .get('/api/code/java')
        .expect(200)
        .expect(jsend.succes(DATA.javaSnippet))
        .expect('Content-Type', /json/)
        .end(done)
    });

    it('/foo should return 404', function (done) {
      supertest(app)
        .get('/api/code/foo')
        .expect(404)
        .end(done)
    });
  });
});
