var _ = require('lodash')
  , Group = require('../repositories/group');

var Finder = function(context) {
  if (this instanceof Finder === false) return new Finder(context);

  this.context = context;
};

Finder.prototype.get = function(id) {
  return Group.getByIdOrHandle(id);
};

Finder.prototype.list = function(query) {
  if (query.id) return Group.listById(query.id);
  if (query.ids) return Group.listByIds(query.ids, query);
  if (query.handle) return Group.listByHandle(query.handle, query);
  if (query.q) return Group.search(query.q, query);

  return Group.list(query);
};  

module.exports = Finder;