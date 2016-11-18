var _ = require('lodash')
  , inherits = require('util').inherits
  , Promise = require('bluebird')
  , Base = require('@recipher/store').Repository
  , util = require('@recipher/store').util
  , authentication = require('@recipher/authentication')
  , schema = require('../schemas/user');

var NAME = 'user';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.getByIdOrHandle = function(identifier) {
  var query = function(user) {
    return user('id').eq(identifier).or(user('handle').eq(identifier));
  };

  return this.find(query).then(function(users) {
    if (users.length) return users[0];
  });
};

Repository.prototype.listById = function(id, options) {
  return this.find({ id: id });
};

Repository.prototype.listByIds = function(ids) {
  return this.find(function(role) {
    return this.database.expr(ids).contains(role('id'));
  }.bind(this));
};

Repository.prototype.listByNetworkId = function(networkId, options) {
  return this.find({ networkId: networkId });
};

Repository.prototype.listByEmail = function(email, options) {
  if (email == null) return Promise.cast();
  return this.find({ email: email }, options);
};

Repository.prototype.listByHandle = function(handle, options) {
  return this.find({ handle: handle }, options);
};

var filterByAuthenticated = function(users, password) {
  if (users.length === 0) return users;

  var matches = authentication.authenticate(users[0].password, password);

  return matches === false ? [] : users;
};

Repository.prototype.listByEmailAndPassword = function(email, password, options) {
  var clean = this.clean.bind(this);
  return this.listByEmail(email, { noClean: true }).then(function(users) {
    return filterByAuthenticated(users, password).map(clean);
  });
};

Repository.prototype.listByHandleAndPassword = function(handle, password, options) {
  var clean = this.clean.bind(this);
  return this.listByHandle(handle, { noClean: true }).then(function(users) {
    return filterByAuthenticated(users, password).map(clean);
  });
};

Repository.prototype.listByGroupId = function(groupId, options) {
  return this.find({ groupId: groupId });
};

Repository.prototype.listByVerificationCode = function(code, options) {
  return this.find({ verificationCode: code });
};

var search = function(query, options) {
  return function(user) {
    return user('name').match('(?i)^' + query).or(
           user('email').match('(?i)' + query));
  };
};

Repository.prototype.search = function(query, options) {
  var filter = search.call(this, query, options);
  return this.find(filter, options);
};

Repository.prototype.total = function(query, options) {
  var filter = search.call(this, query, options);
  return this.count(filter, options);
};

Repository.prototype.sanitize = function(user) {
  if (user == null) return;
  
  if (user.joinedAt) user.joinedAt = new Date(user.joinedAt).toISOString();
  if (user.email) user.email = user.email.toLowerCase();
  
  if (user.confirm) delete user.confirm;

  return user;
};

Repository.prototype.clean = function(user) {
  if (user == null) return;

  delete user.token;
  delete user.password;

  return user;
};

Repository.prototype.generateHandle = function(name) {
  return util.generateHandle(name, this);
};

module.exports = new Repository;
