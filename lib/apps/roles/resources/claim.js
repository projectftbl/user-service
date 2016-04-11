var Claims = require('../services/claims');

module.exports = function(middleware, errors) {
  
  return { 
    delete: function *(next) {
      var claims = new Claims(this.context);

      this.status = 200;
      this.body = { role: yield claims.remove(this.params.id, this.params.entity) };
    }
  };
};