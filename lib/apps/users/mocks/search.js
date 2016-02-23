module.exports = function(middleware, errors) {
  
  return {    
    post: function *(next) {
      this.status = 200;
      this.body = this.request.body;
    }
  };
};