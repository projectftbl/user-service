var Password = require('../services/password');

module.exports = function(middleware, errors) {
  
  return { 
    delete: function *(next) { 
      var password = new Password(this.context);

      yield password.reset(this.params.id);

      this.status = 204;
    }
   
  , post: function *(next) { 
      var password = new Password(this.context);

      yield password.change(this.params.id, this.request.body.password);

      this.status = 204;
    }
  };
};
