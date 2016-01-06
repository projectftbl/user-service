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
