var Finder = require('../services/finder');

module.exports = function(middleware, errors) {
  
  return {    
    post: function *(next) {
      var finder = new Finder(this.context);

      this.status = 200;
      this.body = { users: yield finder.list(this.request.body) };
    }
  };
};