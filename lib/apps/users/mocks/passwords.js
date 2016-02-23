module.exports = function(middleware, errors) {
  
  return { 
    post: function *(next) { 
      this.status = 204;
    }
  };
};
