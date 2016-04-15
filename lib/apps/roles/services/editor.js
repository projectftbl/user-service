var Promise = require('bluebird')
  , utility = require('@ftbl/utility')
  , configuration = require('@ftbl/configuration')
  , Role = require('../repositories/role');

var Editor = function(context) {
  if (this instanceof Editor === false) return new Editor(context);

  this.context = context;
};

Editor.prototype.create = function(data) {
  return Role.generateHandle(utility.slugify(data.handle || data.name)).then(function(handle) {
    data.handle = handle;
    return Role.create(data);
  });
};

Editor.prototype.createDefaults = function() {
  var defaults = configuration('roles');

  return Promise.map(defaults, function(defaultRole) {

    return Role.get(defaultRole.handle).then(function(role) {
      if (role) return role;

      return this.create(defaultRole);
    }.bind(this));
  }.bind(this));
};

Editor.prototype.delete = function(id) {
  return Role.delete(id);
};

module.exports = Editor;