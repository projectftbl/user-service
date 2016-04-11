var Finder = require('../services/finder')
  , Editor = require('../services/editor');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var finder = new Finder(this.context);

      this.status = 200; 
      this.body = { roles: yield finder.list(this.request.query) };
    }
       
  , post: function *(next) {
      var editor = new Editor(this.context);

      this.status = 200; 
      this.body = { role: yield editor.create(this.request.body.role) };
    }
  };
};