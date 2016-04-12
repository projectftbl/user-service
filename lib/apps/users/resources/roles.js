var Editor = require('../services/editor')
  , Finder = require('../services/finder');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) {
      var finder = new Finder(this.context)
        , user = yield finder.get(this.params.id);

      if (user == null) throw new errors.NotFoundError();

      this.status = 200;
      this.body = { roles: user.roles };
    }

  , post: function *(next) {
      var editor = new Editor(this.context)
        , data = this.request.body.role || this.request.body.roles;

      this.status = 200;
      this.body = { user: yield editor.assignRoles(this.params.id, data) };
    }
  };
};