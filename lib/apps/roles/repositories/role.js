var inherits = require('util').inherits
  , Promise = require('bluebird')
  , Base = require('@ftbl/store').Repository
  , util = require('@ftbl/store').util
  , schema = require('../schemas/role');

var NAME = 'role';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.getByIdOrHandle = function(identifier) {
  var query = function(role) {
    return role('id').eq(identifier).or(role('handle').eq(identifier));
  };

  return this.find(query).then(function(roles) {
    if (roles.length) return roles[0];
  });
};

Repository.prototype.listById = function(id, options) {
  return this.find({ id: id });
};

Repository.prototype.listByHandle = function(handle, options) {
  return this.find({ handle: handle }, options);
};

Repository.prototype.sanitize = function(role) {
  if (role == null) return;
  
  return role;
};

Repository.prototype.clean = function(role) {
  if (role == null) return;
  
  return role;
};

Repository.prototype.generateHandle = function(name) {
  return util.generateHandle(name, this);
};

module.exports = new Repository;
