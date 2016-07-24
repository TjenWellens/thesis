var supertest = require('supertest');
var expect = require('chai').expect;

var config = require('../server/config');
var app = require('../server/app')(config);

describe('server routes', function () {
  it('/ should return html', function (next) {
    supertest(app)
      .get('/')
      .expect(200)
      .expect('<!DOCTYPE html><html lang="en"><head><title>Title</title><script type="text/javascript">if (foo) bar(1 + 5)</script></head><body><h1>Jade - node template engine</h1><div id="container" class="col"><p>You are amazing</p><p>Jade is a terse and simple templating language with a\nstrong focus on performance and powerful features.</p></div></body></html>')
      .end(next);
  });
});
