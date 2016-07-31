var supertest = require('supertest');
var expect = require('chai').expect;
var _ = require('underscore');

var config = require('../server/config');
var model = require('./model');
var app = require('../server/app')(config, model);

var Code = model.code;

var DATA = {
  languages: ['java', 'javascript', 'csharp', 'c'],
  javaSnippet: JSON.parse('{"language": "java", "code": ["foo-java"]}')
};

describe('server routes', function () {
  it('/ should redirect to /about', function (next) {
    supertest(app)
      .get('/')
      .expect(302)
      .expect('Location', '/about')
      .end(next);
  });

  describe('front-end routes', function () {
    var routes = [
      '/experiment',
      '/about',
      '/contact',
      '/login',
      '/signup',
    ];

    for (var key in routes) {
      it('should be successful', function (done) {
        verifySuccess(routes[key], done);
      });
    }

    function verifySuccess (route, done) {
      supertest(app)
        .get(route)
        .expect(200)
        .expect('Content-Type', /html/)
        .end(done);
    }
  });

  it('/css/style.css should exits', function (next) {
    supertest(app)
      .get('/css/style.css')
      .expect(200)
      .end(next);
  });

  describe('/api/code', function () {
    it('should return a list of available languages', function (done) {
      supertest(app)
        .get('/api/code')
        .expect(200)
        .expect(DATA.languages)
        .end(done);
    });

    it('/java should return html snippet', function (done) {
      supertest(app)
        .get('/api/code/java')
        .expect(200)
        .expect(DATA.javaSnippet)
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
