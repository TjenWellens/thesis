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
      .send(user)
      .expect(200)
      .end(done);
  });

  describe('after signup', function () {
    var user = {
      email: 'foo',
      password: 'bar'
    };
    var incorrectPasswordUser = {
      email: 'foo',
      password: 'barra'
    };
    var nonExistingUser = {
      email: 'tralala',
      password: 'bar'
    };
    var token;

    before(function subscribe (done) {
      supertest(app)
        .post('/signup')
        .send(user)
        .expect(200)
        .expect(function (res) {
          expect(res.body).to.have.property('token');
          token = res.body.token;
        })
        .end(done);
    });

    it('should be able to login', function (done) {
      supertest(app)
        .post('/login')
        .send(user)
        .expect(200)
        .end(done);
    });

    it('should not be able to login when login incorrect', function (done) {
      supertest(app)
        .post('/login')
        .send(nonExistingUser)
        .expect(401)
        .end(done);
    });

    it('should not be able to login when password incorrect', function (done) {
      supertest(app)
        .post('/login')
        .send(incorrectPasswordUser)
        .expect(401)
        .end(done);
    });

    it('should not be able to register twice', function (done) {
      supertest(app)
        .post('/signup')
        .send(user)
        .expect(401)
        .end(done);
    });

    it('should get user with token', function (done) {
      supertest(app)
        .get('/user')
        .set('x-access-token', token)
        .expect(200)
        .expect(function (req) {
          expect(req.body).to.have.property('email').to.equal(user.email);
          expect(req.body).to.have.property('password').not.to.equal(user.password);
        })
        .end(done);
    });
  });
});
