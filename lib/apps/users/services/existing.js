var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@ftbl/errors')
  , User = require('../repositories/user');

module.exports = Promise.method(function(email) {
  if (email == null) return;

  return User.listByEmail(email).then(function(users) {

    if (users == null || users.length === 0) return;

    var verified = _(users).filter(function(user) {
      return user.verificationCode == null;
    }).value();

    if (verified.length) throw new errors.ValidationError();

    var unverified = _(users).filter(function(user) {
      return user.verificationCode;
    }).value();

    if (unverified.length) return User.truncate({ email: email });
  });
});
