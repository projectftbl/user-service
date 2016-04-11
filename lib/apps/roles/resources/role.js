var Finder = require('../services/finder')
  , Editor = require('../services/editor');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var finder = new Finder(this.context);

      var role = yield finder.get(this.params.id);

      if (role == null) throw new errors.NotFoundError();

      this.status = 200; 
      this.body = { role: role };
    }
    
  , put: function *(next) {
      this.status = 200;
      this.body = this.request.body;
    }
   
  , delete: function *(next) {
      var editor = new Editor(this.context);

      yield editor.delete(this.params.id);

      this.status = 204; 
      this.body = {};
    }
  };
};