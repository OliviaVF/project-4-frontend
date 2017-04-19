angular
  .module('project-4-api')
  .controller('PylonsIndexCtrl', PylonsIndexCtrl)
  .controller('PylonsNewCtrl', PylonsNewCtrl)
  .controller('PylonsEditCtrl', PylonsEditCtrl);

PylonsIndexCtrl.$inject = ['Pylon', 'User', '$stateParams', '$state', '$auth'];
function PylonsIndexCtrl(Pylon, User, $stateParams, $state, $auth) {
  const vm = this;
  if ($auth.getPayload()) vm.currentUser = User.get({ id: $auth.getPayload().id });

  Pylon.query()
  .$promise
  .then((data)=>{
    vm.all = data;
  });

  //vm.pylon = Pylon.get($stateParams);


  function pylonsDelete(pylon) {
      pylon
      .$remove()
      .then(() =>{
        const index = vm.all.indexOf(pylon);
        vm.all.splice(index, 1);
         $state.go('pylonsIndex');
       });
  }

  vm.delete = pylonsDelete;

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

  function search(keyword)  {
    $http.post(`${API_URL}/events`, {
      keyword
      }).then((data)=>{
      console.log(data.data.events);
    });
    vm.search = search;
  }


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

PylonsEditCtrl.$inject = ['Pylon', 'User', '$stateParams', '$state', 'Category'];
function PylonsEditCtrl(Pylon, User, $stateParams, $state, Category) {
  const vm = this;

  Pylon.get($stateParams).$promise.then((pylon) => {
    vm.pylon = pylon;
  });

  vm.categories = Category.query();

  vm.users = User.query();

  function pylonsUpdate() {
    Pylon
      .update({id: vm.pylon.id, pylon: vm.pylon })
      .$promise
      .then(() => $state.go('pylonsShow', { id: vm.pylon.id }));
  }

  vm.update = pylonsUpdate;
}
