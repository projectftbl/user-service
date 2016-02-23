module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) { 
      this.status = 200; 
    }
   
  , post: function *(next) { 
      this.status = 200; 
    }
  };
};