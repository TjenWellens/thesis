var supertest = require('supertest');
var _ = require('underscore');
var mongoMatch = require('../util/mongo-match');
var expect = require('chai').expect;

describe('basics', function () {
  it('= key, = value', function () {
    var model = {
      a: 'b'
    };
    var searchData = {
      a: 'b'
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(true);
  });

  it('= key, ! value', function () {
    var model = {
      a: 'b'
    };
    var searchData = {
      a: 'c'
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(false);
  });

  it('! key, = value', function () {
    var model = {
      a: 'b'
    };
    var searchData = {
      b: 'b'
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(false);
  });
});

describe('objects', function () {
  it('= object', function () {
    var model = {
      a: {c: 'd'}
    };
    var searchData = {
      a: {c: 'd'}
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(true);
  });

  it('! object.key', function () {
    var model = {
      a: {c: 'd'}
    };
    var searchData = {
      a: {x: 'd'}
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(false);
  });

  it('! object.value', function () {
    var model = {
      a: {c: 'd'}
    };
    var searchData = {
      a: {c: 'x'}
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(false);
  });
});

describe('simple dot notation', function () {
  it('= object', function () {
    var model = {
      a: {c: 'd'}
    };
    var searchData = {
      'a.c': 'd'
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(true);
  });

  it('! object.key', function () {
    var model = {
      a: {c: 'd'}
    };
    var searchData = {
      'a.x': 'd'
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(false);
  });

  it('! object.key', function () {
    var model = {
      a: {c: 'd'}
    };
    var searchData = {
      'a.c': 'x'
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(false);
  });
});

describe('nested dot notation', function () {
  it('= o.o.o.o', function () {
    var model = {
      a: {bbb:{cc:{dd:'foo'}}}
    };
    var searchData = {
      'a.bbb.cc.dd': 'foo'
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(true);
  });

  it('= o.o.o.{}', function () {
    var model = {
      a: {bbb:{cc:{dd:'foo'}}}
    };
    var searchData = {
      'a.bbb.cc': {dd:'foo'}
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(true);
  });

  it('= o.x.o.o', function () {
    var model = {
      a: {bbb:{cc:{dd:'foo'}}}
    };
    var searchData = {
      'a.x.cc.dd': 'foo'
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(false);
  });

  it('! o.x.o.{}', function () {
    var model = {
      a: {bbb:{cc:{dd:'foo'}}}
    };
    var searchData = {
      'a.x.cc': {dd:'foo'}
    };

    var result = mongoMatch(model, searchData);
    expect(result).to.equal(false);
  });
});