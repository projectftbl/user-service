var _ = require('lodash')
  , Promise = require('bluebird')
  , User = require('../repositories/user');

var Finder = function(context) {
  if (this instanceof Finder === false) return new Finder(context);

  this.context = context;
};

Finder.prototype.get = function(id) {
  return User.getByIdOrHandle(id);
};

Finder.prototype.list = Promise.method(function(query) {
  if (query.id) return User.listById(query.id);
  if (query.ids) return User.listByIds(query.ids, query);
  if (query.handle) return User.listByHandle(query.handle, query);
  if (query.username && ((query.password && query.password.length) || query.password === '')) return User.listByHandleAndPassword(query.username, decodeURIComponent(query.password), query);
  if (query.username) return User.listByHandle(decodeURIComponent(query.username), query);
  if (query.email && ((query.password && query.password.length) || query.password === '')) return User.listByEmailAndPassword(decodeURIComponent(query.email), decodeURIComponent(query.password), query);
  if (query.email) return User.listByEmail(decodeURIComponent(query.email), query);
  if (query.groupid) return User.listByGroupId(query.groupid, query);
  if (query.networkid) return User.listByNetworkId(query.networkid, query);
  if (query.verificationcode) return User.listByVerificationCode(query.verificationcode, query);
  if (query.q) return User.search(query.q, query);

  return [];
});

module.exports = Finder;