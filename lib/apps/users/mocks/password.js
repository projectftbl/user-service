module.exports = function(middleware, errors) {
  
  return { 
    delete: function *(next) { 
      this.status = 204;
    }
   
  , post: function *(next) { 
      this.status = 204;
    }
  };
};
