angular
  .module('project-4-api')
  .controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$auth'];
function AuthCtrl($auth) {
  const vm = this;

  function register() {
    $auth.signup(vm.user)
      .then(user => console.log(user));
  }

  vm.register = register;

  function login() {
    $auth.login(vm.credentials)
    .then(user => console.log(user));
  }

  vm.login = login;

  function authenticate(provider) {
    $auth.authenticate(provider)
      .then(user => console.log(user));
  }

  vm.authenticate = authenticate;
}
