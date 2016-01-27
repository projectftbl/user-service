module.exports = function(router, resource, middleware, errors) {
  var roles = resource.roles(middleware, errors)
    , role = resource.role(middleware, errors);
  
  router.get('/', roles.get);
  router.post('/', roles.post);
  
  router.get('/:id', role.get);
  router.put('/:id', role.put);
  router.delete('/:id', role.delete);
};
