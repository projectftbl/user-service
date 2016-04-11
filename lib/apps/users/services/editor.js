var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@ftbl/errors')
  , User = require('../repositories/user')
  , Role = require('../../roles/repositories/role')
  , Verifier = require('./verifier');

var Editor = function(context) {
  if (this instanceof Editor === false) return new Editor(context);

  this.context = context;
};

Editor.prototype.edit = function(id, user) {
  var that = this
    , verifier = new Verifier(this.context);

  return User.get(id).then(function(existing) {
    if (existing == null) throw new errors.NotFoundError();

    // Check if email has changed, or verification code has been verified
    return verifier.checkEmailAndVerification(id, user).then(function(user) {
      return User.update(id, user);
    });
  });
};

Editor.prototype.assignRoles = function(id, ids) {
  if (_(ids).isArray() === false) ids = [ ids ];

  return User.get(id).then(function(user) {
    if (user == null) throw new errors.NotFoundError();

    return Role.listByIds(ids).then(function(roles) {
      if (roles.length === 0) return user;

      if (user.roles == null) user.roles = [];

      roles.forEach(function(role) {
        if (_(user.roles).contains(role.id) === false) user.roles.push(role.id);
      });

      return User.update(id, user);
    });
  });
};

Editor.prototype.unassignRoles = function(id, ids) {
  if (_(ids).isArray() === false) ids = [ ids ];

  return User.get(id).then(function(user) {
    if (user == null) throw new errors.NotFoundError();

    return Role.listByIds(ids).then(function(roles) {
      if (roles.length === 0) return user;

      roles = _(roles).pluck('id').value();

      user.roles = _.reject(user.roles || [], function(role) {
        return _.contains(roles, role);
      });

      return User.update(id, user);
    });
  });
};

module.exports = Editor;