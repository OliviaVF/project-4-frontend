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

  vm.delete = pylonsDelete;

  function enableEditor() {

    vm.categories = Category.query();
    console.log(vm.categories);
    vm.editorEnabled = true;
    vm.editableComment = vm.comment;
    vm.editableCategory = vm.category_id;
  }

  vm.enableEditor = enableEditor;
  vm.save = save;
  function save(plon) {
    vm.pylon = plon;
    const thisCategory = vm.pylon.category_id;
    Pylon
     .update({id: vm.pylon.id, pylon: vm.pylon })
     .$promise
     .then(()=>{
      const filtered = vm.categories.filter((category)=>{
         return category.id === thisCategory;
       });
       console.log(filtered);

       vm.pylon.category.name = filtered[0].name;
       console.log(vm.pylon);
       vm.editorEnabled = false;
     });
  }
}

PylonsNewCtrl.$inject = ['Category', 'Pylon', 'User', '$state', '$scope', '$http', 'API_URL'];
function PylonsNewCtrl(Category, Pylon, User, $state, $scope, $http, API_URL) {
  const vm = this;
  vm.categories = Category.query();
  vm.pylon = {};
  vm.users = User.query();

  function pylonsCreate() {
    Pylon
      .save({ pylon: vm.pylon })
      .$promise
      .then(() => $state.go('pylonsIndex'));
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
