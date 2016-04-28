var Promise = require('bluebird')
  , publish = require('@ftbl/task').publish
  , authentication = require('@ftbl/authentication')
  , errors = require('@ftbl/errors')
  , utility = require('@ftbl/utility')
  , rules = require('./rules')
  , User = require('../../repositories/user');

var Password = function(context) {
  if (this instanceof Password === false) return new Password(context);
  
  this.session = context.session;
  this.host = context.host;
  this.context = context;
};

var email = function(user, context) {
  return publish('email', { user: user, template: 'user.password', data: { user: user, force: true }}, { host: context.origin });
};

Password.prototype.change = function(id, data) {

  if (rules(data.password).every(8).match(data.confirm).valid() === false) throw new errors.ValidationError();

  var password = authentication.encrypt(data.password);

  return User.update(id, { password: password.hash
                         , shouldChangePassword: data.shouldChangePassword || false
                         });
};

Password.prototype.reset = function(userId, resetPassword, sendEmail) {
  var context = this.context;
  
  if (resetPassword == null) resetPassword = true;
  if (sendEmail == null) sendEmail = true;

  return User.get(userId).then(function(user) {
    delete user.id;

    user.verificationCode = utility.token(12);
    user.shouldChangePassword = resetPassword;
    user.isLocked = false;

    return User.update(userId, user).then(function() {
      return sendEmail && email(user, context);
    });
  });
};

Password.prototype.resetByEmail = function(email, resetPassword, sendEmail) {
  var that = this;
  
  return User.listByEmail(email).then(function(users) {
    if (email == null || users.length === 0) return;

    return that.reset(users[0].id, resetPassword, sendEmail);
  });
};

module.exports = Password;