/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { spy } from 'sinon';
import http from 'http';
import yakbak from 'yakbak';
import nicoClient from '../../../app/utils/niconico/nico-client';
import { LOGIN_URL } from '../../../app/utils/niconico/nico-client';

let proxy = http.createServer(yakbak(LOGIN_URL, {
  dirname: __dirname + '../tapes'
}));

describe('nico-client', () => {
  before(function (done) {
    proxy.listen(4567, done);
  });

  it('can login', () => {
    const client = new nicoClient('http://localhost:4567');

    client.login()
      .then(function(session){
        console.log(session);
      })
      .catch((err) => {
        console.log(err);
      });

    //console.log(client.login());
    //expect(client.login()).to.deep.equal(true);

    //expect(client.test()).to.deep.equal(true);
  });
});

//var Client = require('./client');
//var assert = require('assert');
//var yakbak = require('yakbak');
//var http = require('http');
//
//var proxy = http.createServer(yakbak('https://api.flickr.com', {
//  dirname: __dirname + '../tapes'
//}));
//
//describe('Client', function () {
//
//  before(function (done) {
//    proxy.listen(4567, done);
//  });
//
//  it('calls flickr.photos.search', function (done) {
//    var subject = new Client('key', 'http://localhost:4567');
//
//    subject.search('coffee', function (err, res) {
//      assert.ifError(err);
//      assert.equal(res.statusCode, 200);
//      assert.equal(res.body.stat, 'ok');
//      done();
//    });
//  });
//
//});
