var User = require('../repositories/user')
  , utility = require('@ftbl/utility')
  , publish = require('@ftbl/task').publish;

var Verifier = function(context) {
  if (this instanceof Verifier === false) return new Verifier(context);

  this.context = context;
};

var update = function(user) {
  var id = user.id;
  user.id = null;
  
  return User.update(id, user);
};

var setupVerification = function(user) {
  user.verificationCode = utility.token(12);

  return update(user);
};

var email = function(user, host) {
  if (user.email == null) return;

  return publish('email', { user: user, template: 'user.verify', data: user, force: true }, { host: host });
};

Verifier.prototype.checkEmailAndVerification = function(id, user) {
  var host = this.context.origin;

  return User.get(id).then(function(existing) {

    if (user.verificationCode == null || 
       (existing.verificationCode != null && user.verificationCode === existing.verificationCode)) {
      user.verificationCode = null;
      return user;
    }
    
    // Don't overwrite with verification code from client
    user.verificationCode = existing.verificationCode;

    if (existing.email === user.email) return user;

    return setupVerification(user).then(function(user) {
      return email(user, host).then(function() {
        return user;
      });
    });
  });
};

module.exports = Verifier;