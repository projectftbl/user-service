module.exports = function(router, resource, middleware, errors) {
  var users = resource.users(middleware, errors)
    , user = resource.user(middleware, errors)
    , search = resource.search(middleware, errors)
    , password = resource.password(middleware, errors)
    , passwords = resource.passwords(middleware, errors)
    , roles = resource.roles(middleware, errors);
  
  router.get('/', users.get);
  router.post('/', users.post);
  router.post('/search', search.post);
  
  router.get('/:id', user.get);
  router.put('/:id', user.put);
  router.delete('/:id', user.delete);
  
  router.post('/:id/password', password.post);
  router.delete('/:id/password', password.delete);
  
  router.post('/passwords', passwords.post);
  
  router.get('/:id/roles', roles.get);
  router.post('/:id/roles', roles.post);
};
