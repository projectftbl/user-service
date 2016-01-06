module.exports = function(router, resource, middleware, errors) {
  var groups = resource.groups(middleware, errors)
    , group = resource.group(middleware, errors)
    , users = resource.users(middleware, errors)
    , roles = resource.roles(middleware, errors);

  router.get('/', groups.get);
  router.post('/', groups.post);
  
  router.get('/:id', group.get);
  router.put('/:id', group.put);
  router.delete('/:id', group.delete);

  router.get('/:id/users', users.get);
  router.post('/:id/users', users.post);

  router.get('/:id/roles', roles.get);
  router.post('/:id/roles', roles.post);
};
