var Editor = require('../services/editor');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) {
      this.status = 200;
      this.body = { roles: [] };
    }

  , post: function *(next) {
      var editor = new Editor(this.context)
        , data = this.request.body.role || this.request.body.roles;

      this.status = 200;
      this.body = { user: yield editor.assignRoles(this.params.id, data) };
    }
  };
};