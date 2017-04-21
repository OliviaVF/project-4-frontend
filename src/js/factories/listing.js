angular
  .module('project-4-api')
  .factory('Listing', Listing);

Listing.$inject = ['$resource', 'API_URL'];
function Listing($resource, API_URL) {
  return new $resource(`${API_URL}/listings/:id`, { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
