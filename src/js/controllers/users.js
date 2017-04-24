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
    const userFollowingIndex = vm.currentUser.following.indexOf(vm.following_id);
    const userFollowerIndex = vm.currentUser.followers.indexOf(vm.follower_id);
    if (index > -1) {
      vm.user.follower_ids.splice(index,1);
      vm.currentUser.following.splice(userFollowingIndex, 1);
      vm.currentUser.followers.splice(userFollowerIndex, 1);
    } else {
      vm.user.follower_ids.push(vm.currentUser.id);
      vm.currentUser.following.push(vm.user);
      vm.currentUser.followers.push(vm.user);
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
    vm.followerRender = true;
    vm.followingRender = false;
    vm.allUsersRender = false;
    vm.filter = "followers";
    vm.allUsers = vm.currentUser.followers;
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
    vm.allPylons = user.pylons;
    filterPylons();

    function isFollowing() {
      return vm.user.$resolved && vm.user.follower_ids.includes(vm.currentUser.id);
    }
    vm.isFollowing = isFollowing;

  });

  function usersDelete() {
    User
    .remove({ id: vm.user.id })
    .$promise
    .then(() => {
      $auth.logout();
      $state.go('register');
    });
  }
  vm.delete = usersDelete;

  function deletePylon(pylon) {
    Pylon
      .delete({ id: pylon.id })
      .$promise
      .then(() => {
        const userIndex = vm.currentUser.pylons.findIndex(userPylon => userPylon.id === pylon.id);
        if(userIndex > -1) vm.currentUser.pylons.splice(userIndex, 1);
        const index = vm.allPylons.findIndex(userPylon => userPylon.id === pylon.id);
        if(index > -1) vm.allPylons.splice(userIndex, 1);
        filterPylons();
        vm.listing = null;
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

  function isPylonVisible(pylon) {
    if(vm.filter === 'me' && determineUser(pylon) === 'userPylon') {
      return true;
    } else if (vm.filter === 'our' && (determineUser(pylon) === 'userPylon' || determineUser(pylon) === 'followingPylon')) {
      return true;
    } else if (vm.filter === 'all' && (determineUser(pylon) === 'userPylon' || determineUser(pylon) === 'followingPylon' || determineUser(pylon) === 'allPylon')) {
      return true;
    } else {
      return false;
    }
  }

  vm.isPylonVisible = isPylonVisible;

  vm.determineUser = determineUser;

  function recreate(pylon, type) {
    const newPylon = {
      listing_id: pylon.listing_id,
      category_id: pylon.category_id,
      comment: pylon.comment,
      google_place_id: pylon.listing.google_place_id
    };

    if (type === "pin") {
      newPylon.feed = false;
    } else {
      newPylon.feed = true;
    }
    Pylon
      .save({ pylon: newPylon })
      .$promise
      .then(() => $state.reload());
  }

  vm.recreate = recreate;

  function enableCommentEditor(pylon) {
    vm.activeComment = pylon.id;
    if(vm.currentUser.id === pylon.user.id)vm.commentEditorEnabled = true;
    vm.editableComment = vm.comment;
  }

  vm.enableCommentEditor = enableCommentEditor;

  function disableCommentEditor() {
    vm.activeComment = null;
    vm.commentEditorEnabled = false;
    vm.editableComment = vm.comment;
  }

  vm.disableCommentEditor = disableCommentEditor;

  function enableCategoryEditor(pylon) {
    vm.active = pylon.id;
    vm.categories = Category.query();
    if(vm.currentUser.id === pylon.user.id)vm.categoryEditorEnabled = true;
    vm.editableCategory = vm.category_id;
  }

  vm.enableCategoryEditor = enableCategoryEditor;

  function disableCategoryEditor() {
    vm.active = null;
    vm.categories = Category.query();
    vm.categoryEditorEnabled = false;
    vm.editableCategory = vm.category_id;
  }

  vm.disableCategoryEditor = disableCategoryEditor;

  vm.commentSave = commentSave;
  function commentSave(pylon) {
    vm.pylon = pylon;
    vm.pylon.category_id = vm.pylon.category.id;
    Pylon
      .update({id: vm.pylon.id, pylon: vm.pylon });
      vm.commentEditorEnabled = false;
  }

  vm.categorySave = categorySave;
  function categorySave(pylon) {
    vm.pylon = pylon;
    const thisCategory = vm.pylon.category_id;
    Pylon
     .update({id: vm.pylon.id, pylon: vm.pylon })
     .$promise
     .then(()=>{
      const filtered = vm.categories.filter((category)=>{
         return category.id === thisCategory;
       });

       vm.pylon.category.name = filtered[0].name;
       console.log(vm.pylon.category.name);
       vm.categoryEditorEnabled = false;
     });
  }
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
