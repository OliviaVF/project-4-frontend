angular
  .module('project-4-api')
  .factory('Category', Category);

Category.$inject = ['$resource', 'API_URL'];
function Category($resource, API_URL) {
  return new $resource(`${API_URL}/categories/:id`, { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
