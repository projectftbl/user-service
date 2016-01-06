module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      yield next;
    
      this.status = 200; 
    }
    
  , post: function *(next) {
      yield next;
      
      this.status = 200;
      this.body = this.request.body;
    }
  };
};