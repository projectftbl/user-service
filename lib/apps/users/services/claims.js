var _ = require('lodash')
  , Promise = require('bluebird')
  , Authorizer = require('@recipher/authorize')
  , Editor = require('./editor')
  , User = require('../repositories/user');

var Claims = function(context) {
  if (this instanceof Claims === false) return new Claims(context);

  this.context = context;
};

Claims.prototype.add = function(id, claims) {
  var editor = new Editor(this.context);

  if (_(claims).isArray() === false) claims = [ claims ];

  return User.get(id).then(function(user) {
    if (user == null) throw new errors.NotFoundError();

    if (user.claims == null) user.claims = [];

    claims.forEach(function(claim) {
      var existing = _.find(user.claims, { entity: claim.entity });

      if (claim.right == null) claim.right = Authorizer.rights.Read;

      if (existing == null) {
        user.claims.push(claim);
      } else {
        existing.right = claim.right;
      }
    });

    user.claims = _.reject(user.claims, { right: Authorizer.rights.Nothing });

    return editor.save(id, user);
  });
};

Claims.prototype.remove = function(id, entity) {
  var editor = new Editor(this.context);

  return User.get(id).then(function(user) {
    if (user == null) throw new errors.NotFoundError();

    user.claims = _.reject(user.claims || [], { entity: entity });

    return editor.save(id, user);
  });
};

module.exports = Claims;