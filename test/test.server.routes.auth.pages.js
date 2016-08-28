var supertest = require('supertest');
var expect = require('chai').expect;
var _ = require('underscore');

var config = require('../server/config');
var model = require('./models/models');
var app = require('../server/app')(config, model);

describe('pages when not authenticated', function () {
  describe('GET', function () {
    var paths = [
      '/experiment',
      '/user',
      '/experiment/result',
    ];

    _.each(paths, getPathShouldRedirectToLogin);

    function getPathShouldRedirectToLogin (path) {
      it(path + ' should redirect to /signup', function (done) {
        supertest(app)
          .get(path)
          .expect(302)
          .expect('Location', '/signup')
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
      it(path + ' should redirect to /signup', function (done) {
        supertest(app)
          .post(path)
          .expect(302)
          .expect('Location', '/signup')
          .end(done);
      });
    }
  });
});

describe('pages when authenticated', function () {
  var agent = supertest.agent(app);

  var user = {
    email: 'info2@example.com',
    password: 'pass1234pass'
  };

  before(function subscribe (done) {
    agent
      .post('/signup')
      .type('form')
      .send(user)
      .expect(302)
      .expect('Location', config.loginSuccessRedirect)
      .expect('set-cookie', /connect.sid/)
      .end(function (err, res) {
        if (err) return done(err);
        agent.saveCookies(res);
        return done();
      });
  });

  describe('GET', function () {
    var routes = [
      '/experiment',
      '/user',
      '/experiment/result',
    ];

    _.each(routes, getRouteShould200);

    function getRouteShould200 (path) {
      it(path + ' should 200', function (done) {
        agent
          .get(path)
          .expect(200)
          .end(done);
      });
    }
  });

  describe('POST', function () {
    var paths = [
      '/experiment',
    ];

    _.each(paths, postPathShouldRedirectToExperimentData);

    function postPathShouldRedirectToExperimentData (path) {
      it(path + ' should redirect to /experiment/result', function (done) {
        agent
          .post(path)
          .expect(302)
          .expect('Location', '/experiment/result')
          .end(done);
      });
    }
  });
});
