var _ = require('lodash')
  , Promise = require('bluebird')
  , User = require('../repositories/user');

var Claims = function(context) {
  if (this instanceof Claims === false) return new Claims(context);

  this.context = context;
};

Claims.prototype.add = function(id, claims) {
  if (_(claims).isArray() === false) claims = [ claims ];

  return User.get(id).then(function(user) {
    if (user == null) throw new errors.NotFoundError();

    if (user.claims == null) user.claims = [];

    claims.forEach(function(claim) {
      var existing = _.find(user.claims, { entity: claim.entity });

      if (existing == null) {
        user.claims.push(claim);
      } else {
        existing.right = claim.right;
      }
    });

    return User.update(id, user);
  });
};

Claims.prototype.remove = function(id, entity) {
  return User.get(id).then(function(user) {
    if (user == null) throw new errors.NotFoundError();

    user.claims = _.reject(user.claims || [], { entity: entity });

    return User.update(id, user);
  });
};

module.exports = Claims;