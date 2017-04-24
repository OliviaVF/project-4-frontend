angular
  .module('project-4-api')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['User', '$rootScope', '$state', '$auth'];
function MainCtrl(User, $rootScope, $state, $auth) {
  const vm = this;
  vm.isAuthenticated = $auth.isAuthenticated;

  $rootScope.$on('error', (e, err) => {
    vm.stateHasChanged = false;
    vm.message = err.data.message;
    $state.go('login');
  });

  $rootScope.$on('$stateChangeSuccess', (e, toState) => {
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
    if($auth.getPayload()) {
      vm.currentUser = $auth.getPayload();
      vm.user = User.get({ id: vm.currentUser.id });
    }
    vm.pageName = toState.name;
  });

  const protectedStates = ['pylonsNew', 'pylonsEdit', 'pylonsIndex', 'usersIndex', 'usersShow', 'usersEdit'];

  $rootScope.$on('$stateChangeStart', (e, toState) => {
    if((!$auth.isAuthenticated() && protectedStates.includes(toState.name))) {
      e.preventDefault();
      $state.go('login');
      vm.message = 'You must be logged in to access this page.';
    }
    // vm.pageName = toState.name;
  });

  function logout() {
    $auth.logout();
    $state.go('home');
  }

  vm.logout = logout;
}
