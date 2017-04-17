angular
  .module('project-4-api')
  .controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['User', '$auth', '$state'];
function AuthCtrl(User, $auth, $state) {
  const vm = this;

  function register() {
    $auth.signup(vm.user)
    .then(() => $state.go('login'));
  }

  vm.register = register;

  function login() {
    $auth.login(vm.credentials)
    .then(() => $state.go('usersIndex'));
  }

  vm.login = login;

  function authenticate(provider) {
    $auth.authenticate(provider)
      .then(() => $state.go('usersIndex'));
  }

  vm.authenticate = authenticate;
}
