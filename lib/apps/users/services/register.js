var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@ftbl/errors')
  , configuration = require('@ftbl/configuration')
  , publish = require('@ftbl/task').publish
  , broadcast = require('@ftbl/bus').broadcast
  , utility = require('@ftbl/utility')
  , authentication = require('@ftbl/authentication')
  , settings = require('../data/settings')
  , rules = require('./password/rules')
  // , Role = require('../../roles/services/finder')
  , User = require('../repositories/user')
  , checkForExistingUsers = require('./existing');

var Register = function(context) {
  if (this instanceof Register === false) return new Register(context);

  this.session = context.session;
  this.host = context.host;
  this.user = context.user;
  this.context = context;
};

var email = Promise.method(function(user, data, host) {
  if (data.noEmail === true) return;
  
  return publish('email', { user: user, template: 'user.create', data: data, force: true }, { host: host });
});

Register.prototype.register = function(data) {
  var context = this.context;

  return checkForExistingUsers(data.email).then(function() {

    return User.generateHandle(utility.slugify(data.name)).then(function(handle) {
      data.handle = handle;

      data = _.assign(data, { settings: settings }, { shouldChangePassword: false });
      
      if (data.password == null) {
        data.password = data.confirm = utility.token(12);
        data.shouldChangePassword = true;
      } else {
        // Don't verify generated password
        if (rules(data.password).every(8).match(data.confirm).valid() === false) throw new errors.ValidationError();
      }

      data.password = authentication.encrypt(data.password).hash;
      data.verificationCode = utility.token(12);
      data.joinedAt = new Date;

      return User.create(data).then(function(user) {
        broadcast('user.create', user, context);

        return email(user, data, context.origin).then(function() {
          return user;
        });
      });
    });
  });
};

module.exports = Register;