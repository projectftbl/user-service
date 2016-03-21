var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@ftbl/errors')
  , configuration = require('@ftbl/configuration')
  , publish = require('@ftbl/task').publish
  , broadcast = require('@ftbl/bus').broadcast
  , utility = require('@ftbl/utility')
  , authentication = require('@ftbl/authentication')
  , settings = require('../data/settings')
  , Group = require('../../groups/services/finder')
  // , Role = require('../../roles/services/finder')
  , User = require('../repositories/user');

var Register = function(context) {
  if (this instanceof Register === false) return new Register(context);

  this.session = context.session;
  this.host = context.host;
  this.user = context.user;
  this.context = context;
};

var getGroup = function(id) {
  return id == null
    ? this.group.unsecured()
    : this.group.get(id);
};

var email = Promise.method(function(user, data, host) {
  if (data.noEmail === true) return;
  
  return publish('email', { user: user, template: 'user.create', data: data, force: true }, { host: host });
});

Register.prototype.register = function(data) {
  var context = this.context;

  return User.listByEmail(data.email).then(function(users) {
    if (users && users.length) return _(users).first();

    return User.generateHandle(utility.slugify(data.name)).then(function(handle) {
      data.handle = handle;

      data = _.assign(data, { settings: settings });
      
      if (data.password == null) data.password = data.confirm = utility.token(12);
      if (data.password !== data.confirm) throw new errors.ValidationError();

      data.password = authentication.encrypt(data.password).hash;
      var verificationCode = utility.token(12);
      data.verificationCode = verificationCode;

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