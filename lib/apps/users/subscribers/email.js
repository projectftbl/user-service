var _ = require('lodash')
  , path = require('path')
  , log = require('@ftbl/log')
  , Emailer = require('@ftbl/email');

var Consumer = function(queue) {
  if (this instanceof Consumer === false) return new Consumer(queue);

  this.queue = queue;
};

var send = function(emailer, data, options) {
  if (data.template) {
    return emailer.sendUsingTemplate(data.user, data.template, _.assign({}, data.data, options), data.force);
  } else {
    return emailer.send(data.user, data.subject, data.text, data.force);
  }
};

var logError = function(err) {
  log.error(err.message, err.stack);
};

Consumer.prototype.listen = function() {
  var emailer = new Emailer;

  this.queue.on('data', function(data, options) {
    send(emailer, data, options).catch(logError);
  });

  this.queue.on('error', logError);

  this.queue.listen('email');
};

module.exports = Consumer;