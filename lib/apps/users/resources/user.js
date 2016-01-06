var Finder = require('../services/finder')
  , Editor = require('../services/editor');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      var finder = new Finder(this.context)
        , user = yield finder.get(this.params.id);

      if (user == null) throw new errors.NotFoundError();

      this.status = 200;
      this.body = { user: user };
    }
   
  , put: function *(next) { 
      var editor = new Editor(this.context)
        , user = yield editor.edit(this.params.id, this.request.body.user);

      if (user == null) throw new errors.NotFoundError();

      this.status = 200;
      this.body = { user: user };
    }
   
  , delete: function *(next) { 
      var editor = new Editor(this.context)
        , user = yield editor.edit(this.params.id, { isArchived: true });

      if (user == null) throw new errors.NotFoundError();

      this.status = 204;
    }
  };
};
