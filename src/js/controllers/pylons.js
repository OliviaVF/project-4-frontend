angular
  .module('project-4-api')
  .controller('PylonsIndexCtrl', PylonsIndexCtrl)
  .controller('PylonsNewCtrl', PylonsNewCtrl);

PylonsIndexCtrl.$inject = ['Pylon', 'User', 'Category', '$stateParams', '$state', '$auth'];
function PylonsIndexCtrl(Pylon, User, Category, $stateParams, $state, $auth) {
  const vm = this;
  if ($auth.getPayload()) vm.currentUser = User.get({ id: $auth.getPayload().id });

  Pylon.feed()
  .$promise
  .then((data)=>{
    vm.all = data;
  });

  function pylonsDelete(pylon) {
      pylon
      .$remove()
      .then(() =>{
        const index = vm.all.indexOf(pylon);
        vm.all.splice(index, 1);
        vm.editorEnabled = false;
         $state.go('pylonsIndex');
       });
  }

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
      .then(() => $state.go('usersShow', { id: vm.currentUser.id }));
  }

  vm.recreate = recreate;


  vm.delete = pylonsDelete;

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
       vm.categoryEditorEnabled = false;
     });
  }
}

PylonsNewCtrl.$inject = ['Category', 'Pylon', 'User', '$state', '$scope', '$http', 'API_URL'];
function PylonsNewCtrl(Category, Pylon, User, $state, $scope, $http, API_URL) {
  const vm = this;
  vm.categories = Category.query();
  vm.pylon = {};
  vm.pylon.feed = true;
  vm.users = User.query();

  function pylonsCreate() {
    if (vm.newForm.$valid) {
      Pylon
        .save({ pylon: vm.pylon })
        .$promise
        .then(() => $state.go('pylonsIndex'));
    }
  }

  vm.create = pylonsCreate;


  function chooseListing(place) {
    const location = place.geometry.location.toJSON();
    vm.pylon.name = place.name;
    vm.pylon.website = place.website;
    vm.pylon.address = place.formatted_address;
    vm.pylon.tel = place.formatted_phone_number;
    vm.pylon.google_place_id = place.place_id;
    vm.pylon.lat = location.lat;
    vm.pylon.lng = location.lng;


    $scope.$apply();

  }

  vm.chooseListing = chooseListing;

}
