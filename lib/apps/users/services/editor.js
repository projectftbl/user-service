var _ = require('lodash')
  , Promise = require('bluebird')
  , broadcast = require('@ftbl/bus').broadcast
  , errors = require('@ftbl/errors')
  , User = require('../repositories/user')
  , Role = require('../../roles/repositories/role')
  , Finder = require('./finder')
  , Verifier = require('./verifier');

var Editor = function(context) {
  if (this instanceof Editor === false) return new Editor(context);

  this.context = context;
};

Editor.prototype.save = function(id, user) {
  var context = this.context
    , finder = new Finder(context);

  return User.update(id, user).then(function(user) {
    return finder.get(id).then(function(user) {
      broadcast('user:update', user, _.assign({}, context, { userId: user.id }));
      return user;
    });
  });
};

Editor.prototype.edit = function(id, user) {
  var that = this
    , verifier = new Verifier(this.context);

  return User.get(id).then(function(existing) {
    if (existing == null) throw new errors.NotFoundError();

    // Check if email has changed, or verification code has been verified
    return verifier.checkEmailAndVerification(id, user).then(function(user) {
      return that.save(id, user);
    });
  });
};

Editor.prototype.assignRoles = function(id, ids) {
  var that = this;

  if (_(ids).isArray() === false) ids = [ ids ];

  return User.get(id).then(function(user) {
    if (user == null) throw new errors.NotFoundError();

    return Role.listByIdsOrHandles(ids).then(function(roles) {
      if (roles.length === 0) return user;

      if (user.roles == null) user.roles = [];

      roles.forEach(function(role) {
        if (_(user.roles).includes(role.id) === false) user.roles.push(role.id);
      });

      return that.save(id, user);
    });
  });
};

Editor.prototype.unassignRoles = function(id, ids) {
  var that = this;

  if (_(ids).isArray() === false) ids = [ ids ];

  return User.get(id).then(function(user) {
    if (user == null) throw new errors.NotFoundError();

    return Role.listByIds(ids).then(function(roles) {
      if (roles.length === 0) return user;

      roles = _(roles).map('id').value();

      user.roles = _.reject(user.roles || [], function(role) {
        return _.includes(roles, role);
      });

      return that.save(id, user);
    });
  });
};

module.exports = Editor;