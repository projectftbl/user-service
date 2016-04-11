var _ = require('lodash')
  , Promise = require('bluebird')
  , Role = require('../repositories/role');

var Finder = function(context) {
  if (this instanceof Finder === false) return new Finder(context);

  this.context = context;
};

Finder.prototype.get = function(id) {
  return Role.getByIdOrHandle(id);
};

Finder.prototype.list = Promise.method(function(query) {
  if (query.id) return Role.listById(query.id);
  if (query.ids) return Role.listByIds(query.ids, query);
  if (query.handle) return Role.listByHandle(query.handle, query);

  return Role.find({}, query);
});

module.exports = Finder;