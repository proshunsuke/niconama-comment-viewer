var request = require('superagent');

/**
 * @constructor
 */

module.exports = Client;

function Client(api_key) {
  this.params = {};
  this.params.api_key = api_key;
  this.params.format = 'json';
  this.params.nojsoncallback = 1;
}

Client.prototype = Object.create(null);

Client.prototype.search = function (text, done) {
  request('GET', 'https://api.flickr.com/services/rest')
    .query('method=flickr.photos.search')
    .query('text=' + text)
    .query(this.params)
    .end(done);
};
