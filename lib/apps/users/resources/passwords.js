var Password = require('../services/password');

module.exports = function(middleware, errors) {
  
  return { 
    post: function *(next) { 
      var password = new Password(this.context);

      yield password.resetByEmail(
        this.request.body.email, this.request.body.resetPassword, this.request.body.sendEmail);
      this.status = 204;
    }
  };
};
