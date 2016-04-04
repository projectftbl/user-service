var Promise = require('bluebird')
  , User = require('../repositories/user')
  , Verifier = require('./verifier');

var Editor = function(context) {
  if (this instanceof Editor === false) return new Editor(context);

  this.context = context;
};

Editor.prototype.edit = function(id, user) {
  var that = this
    , verifier = new Verifier(this.context);

  return User.get(id).then(function(existing) {

    // Check if email has changed, or verification code has been verified
    return verifier.checkEmailAndVerification(id, user).then(function(user) {
      return User.update(id, user);
    });
  });
};

module.exports = Editor;