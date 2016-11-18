var _ = require('lodash')
  , path = require('path')
  , log = require('@recipher/log')
  , Claims = require('../services/claims');

var Subscriber = function(queue) {
  if (this instanceof Subscriber === false) return new Subscriber(queue);

  this.queue = queue;
};

var logError = function(err) {
  log.error(err.message, err.stack);
};

Subscriber.prototype.subscribe = function() {
  this.queue.on('data', function(data, options) {
    new Claims(options).add(data.user, data.claim);
  });

  this.queue.on('error', logError);

  this.queue.subscribe('user:claim');
};

module.exports = Subscriber;