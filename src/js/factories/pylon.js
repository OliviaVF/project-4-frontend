angular
  .module('project-4-api')
  .factory('Pylon', Pylon);

Pylon.$inject = ['$resource', 'API_URL'];
function Pylon($resource, API_URL) {
  return new $resource(`${API_URL}/pylons/:id`, { id: '@id' }, {
    update: { method: 'PUT' },
    feed: { method: 'GET', url: `${API_URL}/feed`, isArray: true }
  });
}
