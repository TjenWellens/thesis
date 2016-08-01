var supertest = require('supertest');
var expect = require('chai').expect;
var _ = require('underscore');

var config = require('../server/config');
var model = require('./models/models');
var app = require('../server/app')(config, model);

describe('server routes pages', function () {
  it('/ should redirect to /about', function (next) {
    supertest(app)
      .get('/')
      .expect(302)
      .expect('Location', '/about')
      .end(next);
  });

  describe('front-end routes', function () {
    var routes = [
      '/about',
      '/contact',
      '/login',
      '/signup',
    ];

    _.each(routes, getRouteShould200);

    function getRouteShould200 (route) {
      it(route + ' should 200', function (done) {
        supertest(app)
          .get(route)
          .expect(200)
          .expect('Content-Type', /html/)
          .end(done);
      });
    }
  });

  it('/css/style.css should exit', function (next) {
    supertest(app)
      .get('/css/style.css')
      .expect(200)
      .end(next);
  });

  it('/js/experiment.js should exit', function (next) {
    supertest(app)
      .get('/js/experiment.js')
      .expect(200)
      .end(next);
  });
});
