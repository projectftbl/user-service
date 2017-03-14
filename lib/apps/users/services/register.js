var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@recipher/errors')
  , log = require('@recipher/log')
  , configuration = require('@recipher/configuration')
  , publish = require('@recipher/task').publish
  , broadcast = require('@recipher/bus').broadcast
  , utility = require('@recipher/utility')
  , authentication = require('@recipher/authentication')
  , settings = require('../data/settings')
  , rules = require('./password/rules')
  , Role = require('../../roles/services/finder')
  , Editor = require('../../roles/services/editor')
  , User = require('../repositories/user')
  , checkForExistingUsers = require('./existing');

var DEFAULT_ROLES = configuration('roles');

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

var getDefaultRoles = Promise.method(function(context) {
  if (context.user == null || context.user.roles == null) return;

  var handles = _(context.user.roles).map('handle').value();

  return new Role(context).list({ handles: handles }).then(function(roles) {
    // Populate any missing roles
    if (roles.length !== context.user.roles.length) {
      return new Editor(context).createDefaults().then(function(defaults) {
        return _
        .chain(roles)
        .concat(defaults)
        .compact()
        .uniqBy('id')
        .filter(function(role) {
          return _.find(context.user.roles, { handle: role.handle });
        })
        .map('id')
        .value();
      });
    }
    return _(roles).map('id').value();
  });
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
        // if (rules(data.password).minimum(8).match(data.confirm).valid() === false) throw new errors.ValidationError();
      }

      data.password = authentication.encrypt(data.password).hash;
      data.verificationCode = utility.token(12);
      data.joinedAt = new Date;

      return getDefaultRoles(context).then(function(roles) {
        data.roles = roles;

        return User.create(data).then(function(user) {
          broadcast('user.create', user, context);

          return email(user, data, context.origin).then(function() {
            return user;
          });
        });
      });
    });
  });
};

module.exports = Register;