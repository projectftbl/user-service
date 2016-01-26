var Register = require('../services/register')
  , Finder = require('../services/finder');

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) {
      // var finder = new Finder(this.context);

      require('@ftbl/log').log('Hello!');

      this.status = 200;
      this.body = { users: [] } //yield finder.list(this.request.query) };
    }
   
  , post: function *(next) {
      var register = new Register(this.context);

      this.status = 200;
      this.body = { user: yield register.register(this.request.body.user) };
    }
  };
};