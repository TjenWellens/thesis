var supertest = require('supertest');
var expect = require('chai').expect;

var config = require('../server/config');
var app = require('../server/app')(config);

describe('server routes', function () {
  it('/ should return Hello World', function (next) {
    supertest(app)
      .get('/')
      .expect(200)
      .expect('Hello World')
      .end(next);
  });
});
