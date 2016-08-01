var supertest = require('supertest');
var expect = require('chai').expect;
var _ = require('underscore');

var config = require('../server/config');
var model = require('./models/models');
var app = require('../server/app')(config, model);

describe('authentication', function () {
  it('should be able to signup', function (done) {
    var user = {
      email: 'tjen.wellens@gmail.com',
      password: 'pass1234'
    };

    supertest(app)
      .post('/signup')
      .type('form')
      .send(user)
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });

  describe('after signup', function () {
    var user = {
      email: 'info@example.com',
      password: 'pass1234pass'
    };
    var incorrectPasswordUser = {
      email: 'info@example.com',
      password: 'foo'
    };
    var nonExistingUser = {
      email: 'foo',
      password: 'pass1234pass'
    };

    before(function subscribe (done) {
      supertest(app)
        .post('/signup')
        .type('form')
        .send(user)
        .expect(302)
        .expect('Location', '/')
        .end(done);
    });

    it('should be able to login', function (done) {
      supertest(app)
        .post('/login')
        .type('form')
        .send(user)
        .expect(302)
        .expect('Location', '/')
        .end(done);
    });

    it('should not be able to login when login incorrect', function (done) {
      supertest(app)
        .post('/login')
        .type('form')
        .send(nonExistingUser)
        .expect(302)
        .expect('Location', '/login')
        .end(done);
    });

    it('should not be able to login when password incorrect', function (done) {
      supertest(app)
        .post('/login')
        .type('form')
        .send(incorrectPasswordUser)
        .expect(302)
        .expect('Location', '/login')
        .end(done);
    });

    it('should not be able to register twice', function (done) {
      supertest(app)
        .post('/signup')
        .type('form')
        .send(user)
        .expect(302)
        .expect('Location', '/signup')
        .end(done);
    });
  });
});
