var Editor = require('../services/editor');

module.exports = function(middleware, errors) {
  
  return { 
    delete: function *(next) {
      var editor = new Editor(this.context);

      this.status = 200;
      this.body = { user: yield editor.unassignRoles(this.params.id, this.params.role) };
    }
  };
};