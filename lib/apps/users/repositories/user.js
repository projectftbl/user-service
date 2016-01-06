var _ = require('lodash')
  , inherits = require('util').inherits
  , Promise = require('bluebird')
  , Base = require('@ftbl/store').Repository
  , util = require('@ftbl/store').util
  , authentication = require('@ftbl/authentication')
  , schema = require('../schemas/user');

var NAME = 'user';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.getByIdOrHandle = function(identifier) {
  return this.find({ id: { '==': identifier }, handle: { '|==': identifier }}).then(function(users) {
    if (users.length) return users[0];
  });
};

Repository.prototype.listByNetworkId = function(networkId, options) {
  return this.find({ networkId: networkId });
};

Repository.prototype.listByEmail = function(email, options) {
  return this.find({ email: email });
};

Repository.prototype.listByHandle = function(handle, options) {
  return this.find({ handle: handle });
};

var filterByAuthenticated = function(users, password) {
  if (users.length === 0) return users;

  var matches = authentication.authenticate(users[0].password, password);

  return matches === false ? [] : users;
};

Repository.prototype.listByEmailAndPassword = function(email, password, options) {
  var clean = this.clean.bind(this);
  return this.listByEmail(email).then(function(users) {
    return filterByAuthenticated(users, password).map(clean);
  });
};

Repository.prototype.listByHandleAndPassword = function(handle, password, options) {
  var clean = this.clean.bind(this);
  return this.listByHandle(handle).then(function(users) {
    return filterByAuthenticated(users, password).map(clean);
  });
};

Repository.prototype.listByGroupId = function(groupId, options) {
  return this.find({ groupId: groupId });
};

Repository.prototype.listByVerificationCode = function(code, options) {
  return this.find({ verificationCode: code });
};

Repository.prototype.search = function(query, options) {
  var opts = {
    sort: 'name'
  };

  return this.find({ name: new RegExp(query, 'i') }, opts);
};

Repository.prototype.sanitize = function(user) {
  if (user == null) return;
  
  if (user.dob) user.dob = new Date(user.dob);
  if (user.email) user.email = user.email.toLowerCase();
  
  if (user.confirm) delete user.confirm;

  return user;
};

Repository.prototype.clean = function(user) {
  if (user == null) return;

  delete user.token;
  delete user.password;
  // delete user.verificationCode;

  return user;
};

Repository.prototype.generateHandle = function(name) {
  return util.generateHandle(name, this);
};

module.exports = new Repository;
