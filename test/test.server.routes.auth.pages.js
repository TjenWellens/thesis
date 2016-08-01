var supertest = require('supertest');
var expect = require('chai').expect;
var _ = require('underscore');

var config = require('../server/config');
var model = require('./models/models');
var app = require('../server/app')(config, model);

var Code = model.code;

var DATA = {
  languages: ['java', 'javascript', 'csharp', 'c'],
  javaSnippet: JSON.parse('{"language": "java", "code": ["foo-java"]}')
};

describe('routes when not authenticated', function () {
  describe('GET', function () {
    var paths = [
      '/experiment',
      '/user',
      '/user/experiment',
    ];

    _.each(paths, getPathShouldRedirectToLogin);

    function getPathShouldRedirectToLogin (path) {
      it(path + ' should redirect to /login', function (done) {
        supertest(app)
          .get(path)
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });
    }
  });

  describe('POST', function () {
    var paths = [
      '/experiment',
    ];

    _.each(paths, postPathShouldRedirectToLogin);

    function postPathShouldRedirectToLogin (path) {
      it(path + ' should redirect to /login', function (done) {
        supertest(app)
          .post(path)
          .expect(302)
          .expect('Location', '/login')
          .end(done);
      });
    }
  });
});
