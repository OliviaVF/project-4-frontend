angular
  .module('project-4-api')
  .controller('UsersIndexCtrl', UsersIndexCtrl)
  .controller('UsersShowCtrl', UsersShowCtrl)
  .controller('UsersEditCtrl', UsersEditCtrl);

UsersIndexCtrl.$inject = ['User'];
function UsersIndexCtrl(User) {
  const vm = this;

  vm.all = User.query();
}

UsersShowCtrl.$inject = ['User', '$stateParams', '$state', '$auth'];
function UsersShowCtrl(User, $stateParams, $state, $auth) {
  const vm = this;

  if ($auth.getPayload()) vm.currentUser = User.get({ id: $auth.getPayload().id });

  vm.user = User.get($stateParams);

  function usersDelete() {

    vm.user
      .$remove()
      .then(() => {
        $auth.logout();
        $state.go('register');
      });
  }
  vm.delete = usersDelete;

  function toggleFollowing() {
    const index = vm.user.follower_ids.indexOf(vm.currentUser.id);
    console.log(index);
    if (index > -1) {
      vm.user.follower_ids.splice(index,1);
    } else {
      vm.user.follower_ids.push(vm.currentUser.id);
    }

    User.update({ id: vm.user.id, user: vm.user })
      .$promise
      .then(() => $state.reload());
  }

  vm.toggleFollowing = toggleFollowing;

  function isFollowing() {
    return vm.user.$resolved && vm.user.follower_ids.includes(vm.currentUser.id);
  }

  vm.isFollowing = isFollowing;
}

UsersEditCtrl.$inject = ['User', '$stateParams', '$state'];
function UsersEditCtrl(User, $stateParams, $state) {
  const vm = this;

  vm.user = User.get($stateParams);

  function usersUpdate() {
    // wrap the data in a `bird` object and pass the bird's id
    // to the model so it can generate the correct URL
    User.update({ id: vm.user.id, user: vm.user})
      .$promise
      .then(() => $state.go('usersShow', $stateParams));
  }

  vm.update = usersUpdate;
}
