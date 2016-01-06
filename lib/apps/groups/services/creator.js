var _ = require('lodash')
  , Promise = require('bluebird')
  , errors = require('@ftbl/errors')
  , configuration = require('@ftbl/configuration')
  , utility = require('@ftbl/utility')
  , settings = require('../data/settings')
  , Group = require('../repositories/group');

var Creator = function(context) {
  if (this instanceof Creator === false) return new Creator(context);

  this.session = context.session;
  this.context = context;
};

Creator.prototype.create = function(data) {
  return Group.generateHandle(utility.slugify(data.name)).then(function(handle) {
    data.handle = handle;

    data = _.assign(data, { settings: settings });

    data.apiKey = utility.token(12);
    data.code = 100000 + utils.random(899999);

    return Group.create(data);
  });
};

module.exports = Creator;