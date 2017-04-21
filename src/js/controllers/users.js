angular
  .module('project-4-api')
  .controller('UsersIndexCtrl', UsersIndexCtrl)
  .controller('UsersShowCtrl', UsersShowCtrl)
  .controller('UsersEditCtrl', UsersEditCtrl);

UsersIndexCtrl.$inject = ['User', '$auth', '$scope', '$state'];
function UsersIndexCtrl(User, $auth, $scope, $state) {
  const vm = this;
  vm.allUsers = [];
  vm.filter = "allUsers";
  vm.allUsersRender = true;

  if ($auth.getPayload()) vm.currentUser = User.get({ id: $auth.getPayload().id });

  vm.all = User.query();

  function isFollowing(user) {
    return user.follower_ids.includes(vm.currentUser.id);
  }
  vm.isFollowing = isFollowing;

  function toggleFollowing(user) {
    vm.user = user;
    const index = vm.user.follower_ids.indexOf(vm.currentUser.id);
    if (index > -1) {
      vm.user.follower_ids.splice(index,1);
    } else {
      vm.user.follower_ids.push(vm.currentUser.id);
    }

    User.update({ id: vm.user.id, user: vm.user })
      .$promise
      .then((result) => result);
  }

  vm.toggleFollowing = toggleFollowing;

  function getAllUsers() {
    vm.allUsersRender = true;
    vm.followingRender = false;
    vm.followerRender = false;
    vm.filter = "allUsers";
    User.query()
      .$promise
      .then((users) => {
        vm.allUsers = users;
      });
  }

  function getFollowing() {
    vm.followingRender = true;
    vm.allUsersRender = false;
    vm.followerRender = false;
    vm.filter = "following";
    vm.allUsers = vm.currentUser.following;
  }

  function getFollowers() {
    console.log(vm.currentUser);
    vm.followerRender = true;
    vm.followingRender = false;
    vm.allUsersRender = false;
    vm.filter = "followers";
    vm.allUsers = vm.currentUser.followers;
    console.log(vm.allUsers);
  }

  vm.getAllUsers = getAllUsers;
  vm.getFollowing = getFollowing;
  vm.getFollowers = getFollowers;

}

UsersShowCtrl.$inject = ['User', 'Pylon', 'Listing', 'Category', 'filterFilter', '$stateParams', '$state', '$auth', '$scope'];
function UsersShowCtrl(User, Pylon, Listing, Category, filterFilter, $stateParams, $state, $auth, $scope) {
  const vm = this;
  vm.allPylons = [];
  vm.filter = "me";

  if ($auth.getPayload()) vm.currentUser = User.get({ id: $auth.getPayload().id });


  User.get($stateParams, (user)=>{
    vm.user = user;
    console.log(vm.user);
    vm.allPylons = user.pylons;
    filterPylons();

    function isFollowing() {
      return vm.user.$resolved && vm.user.follower_ids.includes(vm.currentUser.id);
    }
    vm.isFollowing = isFollowing;

  });

  function usersDelete() {

    vm.user
      .$remove()
      .then(() => {
        $auth.logout();
        $state.go('register');
      });
  }
  vm.delete = usersDelete;

  function deletePylon() {
    Pylon
      .delete({ id: vm.selectedPylon.id })
      .$promise
      .then(() => {
        const index = vm.user.pylon.indexOf(vm.selectedPylon);
        if(index > -1) vm.user.pylon.splice(index, 1);
        vm.selectedPylon = null;
      });
  }

  vm.deletePylon = deletePylon;

  function toggleFollowing() {
    const index = vm.user.follower_ids.indexOf(vm.currentUser.id);
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

  vm.categoryPylon = '';
  vm.categories = Category.query();

  function filterPylons() {
    vm.filteredPylons = filterFilter(vm.allPylons, { category: { id: vm.categoryPylon }});
  }

  function getAllPylons() {
    vm.filter = "all";
    Pylon.query()
      .$promise
      .then((pylons) => {
        vm.allPylons = pylons;
        filterPylons();
        console.log(pylons);
      });
  }

  function getMyPylons() {
    vm.filter = "me";
    vm.allPylons = vm.user.pylons;
    filterPylons();
  }

  function getOurPylons() {
    vm.filter = "our";
    let pylons = [];
    vm.user.following.forEach((user) => {
      user.pylons.forEach((pylon) => {
        pylons.push(pylon);
      });
    });
    vm.allPylons = pylons.concat(vm.user.pylons);
    filterPylons();
  }

  vm.getAllPylons = getAllPylons;
  vm.getMyPylons = getMyPylons;
  vm.getOurPylons = getOurPylons;

  $scope.$watchGroup([
    () => vm.allPylons.$resolved,
    () => vm.categoryPylon
  ], filterPylons);

  $scope.$watchGroup([
    () => vm.selectedListing,
  ], getListing);

  function getListing() {
    if(vm.selectedListing) vm.listing = Listing.get({id: vm.selectedListing.id });
  }

  function belongsToFollowing(pylon) {
    let pylons = [];
    vm.user.following.forEach((user) => {
      user.pylons.forEach((pylon) => {
        pylons.push(pylon);
      });
    });
    return pylons.find((userPylon) => {
      return userPylon.user.id === pylon.user.id;
    });
  }

  function determineUser(pylon) {
    if (pylon.user.id === vm.currentUser.id) {
      return "userPylon";
    } else if (belongsToFollowing(pylon)) {
      return "followingPylon";
    } else {
      return "allPylon";
    }
  }

  vm.determineUser = determineUser;


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
