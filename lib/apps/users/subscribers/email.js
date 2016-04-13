var _ = require('lodash')
  , path = require('path')
  , log = require('@ftbl/log')
  , Emailer = require('@ftbl/email');

var Subscriber = function(queue) {
  if (this instanceof Subscriber === false) return new Subscriber(queue);

  this.queue = queue;
};

var send = function(emailer, data, options) {
  if (data.template) {
    return emailer.sendUsingTemplate(data.user, data.template, _.assign({}, data.data, options), data.force);
  } else {
    return emailer.send(data.user, data.subject, data.text, data.replyTo, data.force);
  }
};

var logError = function(err) {
  log.error(err.message, err.stack);
};

Subscriber.prototype.subscribe = function() {
  var emailer = new Emailer(path.join(__dirname, '..', '..', '..', 'templates', 'email'));

  this.queue.on('data', function(data, options) {
    send(emailer, data, options).catch(logError);
  });

  this.queue.on('error', logError);

  this.queue.subscribe('email');
};

module.exports = Subscriber;