var Password = require('../services/password');

module.exports = function(middleware, errors) {
  
  return { 
    post: function *(next) { 
      var password = new Password(this.context);

      yield password.resetByEmail(this.request.body.email);

      this.status = 204;
    }
  };
};
