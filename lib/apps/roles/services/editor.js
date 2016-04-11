var Promise = require('bluebird')
  , utility = require('@ftbl/utility')
  , Role = require('../repositories/role');

var Editor = function(context) {
  if (this instanceof Editor === false) return new Editor(context);

  this.context = context;
};

Editor.prototype.create = function(data) {
  return Role.generateHandle(utility.slugify(data.name)).then(function(handle) {
    data.handle = handle;
    return Role.create(data);
  });
};

Editor.prototype.delete = function(id) {
  return Role.delete(id);
};

module.exports = Editor;