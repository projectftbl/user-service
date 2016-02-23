module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      this.status = 200;
    }
   
  , put: function *(next) { 
      this.status = 200;
      this.body = this.request.body;
    }
   
  , delete: function *(next) { 
      this.status = 204;
      this.body = this.request.body;
    }
  };
};
