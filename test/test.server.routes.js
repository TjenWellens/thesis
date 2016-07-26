var supertest = require('supertest');
var expect = require('chai').expect;

var config = require('../server/config');
var app = require('../server/app')(config);

describe('server routes', function () {
  it('/ should redirect to /test', function (next) {
    supertest(app)
      .get('/')
      .expect(302)
      .expect('Location', '/test')
      .end(next);
  });

  describe('front-end routes', function () {
    var routes = [
      '/test',
      '/about',
      '/contact',
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

  it('/stylesheets/style.css should exits', function (next) {
    supertest(app)
      .get('/stylesheets/style.css')
      .expect(200)
      .end(next);
  });

  describe('/api/code', function () {
    it('/java should return html snippet', function (done) {
      supertest(app)
        .get('/api/code/java')
        .expect(200)
        .expect('Content-Type', /html/)
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
