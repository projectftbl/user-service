var _ = require('lodash')
  , inherits = require('util').inherits
  , Promise = require('bluebird')
  , Base = require('@ftbl/store').Repository
  , util = require('@ftbl/store').util
  , schema = require('../schemas/group');

var NAME = 'group';

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, NAME, schema);
};

inherits(Repository, Base);

Repository.prototype.getByIdOrHandle = function(identifier) {
  return this.find({ id: { '==': identifier }, handle: { '!==': identifier }}).then(function(groups) {
    if (groups.length) return groups[0];
  });
};

Repository.prototype.search = function(query, options) {
  var opts = {
    sort: 'name'
  };

  return this.find({ name: new RegExp(query, 'i') }, opts);
};

Repository.prototype.sanitize = function(group) {
  if (group == null) return;
  
  return group;
};

Repository.prototype.clean = function(group) {
  if (group == null) return;

  return group;
};

Repository.prototype.generateHandle = function(name) {
  return util.generateHandle(name, this);
};

module.exports = new Repository;
