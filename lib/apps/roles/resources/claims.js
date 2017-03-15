var Claims = require('../services/claims');

module.exports = function(middleware, errors) {
  
  return { 
    post: function *(next) {
      var claims = new Claims(this.context)
        , data = this.request.body.claim || this.request.body.claims;

      this.status = 200;
      this.body = { role: yield claims.add(this.params.id, data) };
    }
  };
};