var supertest = require('supertest');
var expect = require('chai').expect;

var config = require('../server/config');
var app = require('../server/app')(config);

describe('server routes', function () {
  it('/ should exits', function (next) {
    supertest(app)
      .get('/')
      .expect(200)
      .end(next);
  });

  it('/stylesheets/style.css should exits', function (next) {
    supertest(app)
      .get('/stylesheets/style.css')
      .expect(200)
      .end(next);
  });
});
