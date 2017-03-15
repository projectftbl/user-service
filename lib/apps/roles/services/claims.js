var _ = require('lodash')
  , log = require('@recipher/log')
  , Promise = require('bluebird')
  , Role = require('../repositories/role');

var Claims = function(context) {
  if (this instanceof Claims === false) return new Claims(context);

  this.context = context;
};

Claims.prototype.add = function(id, claims) {
  log.info(id, claims);

  if (_(claims).isArray() === false) claims = [ claims ];

  return Role.get(id).then(function(role) {
    if (role == null) throw new errors.NotFoundError();

    if (role.claims == null) role.claims = [];

    claims.forEach(function(claim) {
      log.info(claim);
      
      var existing = _.find(role.claims, { entity: claim.entity });

      if (existing == null) {
        role.claims.push(claim);
      } else {
        existing.right = claim.right;
      }
    });

    return Role.update(id, role);
  });
};

Claims.prototype.remove = function(id, entity) {
  return Role.get(id).then(function(role) {
    if (role == null) throw new errors.NotFoundError();

    role.claims = _.reject(role.claims || [], { entity: entity });

    return Role.update(id, role);
  });
};

module.exports = Claims;