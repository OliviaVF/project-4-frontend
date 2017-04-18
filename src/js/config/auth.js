angular
  .module('project-4-api')
  .config(Auth);

Auth.$inject = ['$authProvider', 'API_URL'];
function Auth($authProvider, API_URL) {
  $authProvider.signupUrl = `${API_URL}/register`;
  $authProvider.loginUrl = `${API_URL}/login`;

  $authProvider.facebook({
    clientId: '724001187780311',
    url: `${API_URL}/auth/facebook`
  });
}
