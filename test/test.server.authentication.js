var supertest = require('supertest');
var expect = require('chai').expect;
var _ = require('underscore');

var config = require('../server/config');
var model = require('../server/model');
var app = require('../server/app')(config, model);

describe('authentication', function () {
  it('should be able to signup', function (done) {
    var user = {
      email: 'tjen.wellens@gmail.com',
      password: 'pass1234'
    };

    supertest(app)
      .post('/signup')
      .field('email', user.email)
      .field('password', user.password)
      .expect(200)
      .end(done);
  });

  describe('after signup', function () {
    var user = {
      email: 'foo',
      password: 'bar'
    };

    before(function subscribe (done) {
      supertest(app)
        .post('/signup')
        .field('email', user.email)
        .field('password', user.password)
        .expect(200)
        .end(done);
    });

    it('should be able to login', function (done) {
      supertest(app)
        .post('/login')
        .field('email', user.email)
        .field('password', user.password)
        .expect(200)
        .end(done);
    });

    it('should not be able to login when login incorrect', function (done) {
      supertest(app)
        .post('/login')
        .field('email', user.email)
        .field('password', user.password)
        .expect(401)
        .end(done);
    });

    it('should not be able to register when already exists', function (done) {
      supertest(app)
        .post('/signup')
        .field('email', user.email)
        .field('password', user.password)
        .expect(401)
        .end(done);
    });
  });
});
