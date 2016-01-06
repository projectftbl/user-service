var Promise = require('bluebird')
  , User = require('../repositories/user')
  , Verifier = require('./verifier')
  , Group = require('../../groups/services/finder');

var Editor = function(context) {
  if (this instanceof Editor === false) return new Editor(context);

  this.context = context;
};

var moveGroup = Promise.method(function(user, existing) {
  if (user.group == null) return user;

  if (user.groupId === existing.groupId) return user;

  var finder = new Group(this.context);

  return finder.get(user.groupId).then(function(group) {
    user.key = group.key;
    user.code = group.code;

    return user;
  });
});

Editor.prototype.edit = function(id, user) {
  var that = this
    , verifier = new Verifier(this.context);

  return User.get(id).then(function(existing) {

    // Moving the user to a different group?
    return moveGroup.call(that, user, existing).then(function(user) {

      // Check if email has changed, or verification code has been verified
      return verifier.checkEmailAndVerification(id, user).then(function(user) {
        return User.update(id, user);
      });
    });
  });
};

module.exports = Editor;