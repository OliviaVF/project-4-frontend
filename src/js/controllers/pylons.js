angular
  .module('project-4-api')
  .controller('PylonsIndexCtrl', PylonsIndexCtrl)
  .controller('PylonsNewCtrl', PylonsNewCtrl)
  .controller('PylonsShowCtrl', PylonsShowCtrl)
  .controller('PylonsEditCtrl', PylonsEditCtrl);

PylonsIndexCtrl.$inject = ['Pylon'];
function PylonsIndexCtrl(Pylon, place) {
  const vm = this;

  Pylon.query()
  .$promise
  .then((data)=>{
    vm.all = data;
    console.log(vm.all[0]);
  });

}

PylonsNewCtrl.$inject = ['Pylon', 'User', '$state', '$scope', '$http'];
function PylonsNewCtrl(Pylon, User, $state, $scope, $http) {
  const vm = this;
  vm.pylon = {};
  vm.listing = {};
  vm.users = User.query();

  function pylonsCreate() {
    vm.listing.name = vm.pylon.name;
    vm.listing.website = vm.pylon.website;
    vm.listing.address = vm.pylon.address;
    vm.listing.telephone = vm.pylon.telephone;
    console.log(vm.listing);
    Pylon
      .save({pylon: vm.pylon }, {listing: vm.listing})
      .$promise
      .then(() => $state.go('pylonsIndex'));
  }

  vm.create = pylonsCreate;

  function search(keyword){
    $http.post('http://localhost:3000/api/events', {
      keyword
      }).then((data)=>{
      console.log(data.data.events);
    });
    vm.search = search;
  }


  function chooseListing(place) {
    vm.pylon.name = place.name;
    vm.pylon.website = place.website;
    vm.pylon.address = place.formatted_address;
    vm.pylon.telephone = place.formatted_phone_number;
    vm.pylon.google_place_id = place.place_id;
    $scope.$apply();

  }

  vm.chooseListing = chooseListing;

}

PylonsShowCtrl.$inject = ['Pylon', 'User', '$stateParams', '$state', '$auth'];
function PylonsShowCtrl(Pylon, User, $stateParams, $state, $auth) {
  const vm = this;
  if ($auth.getPayload()) vm.currentUser = User.get({ id: $auth.getPayload().id });

  vm.pylon = Pylon.get($stateParams);

  function pylonsDelete() {
    vm.pylon
      .$remove()
      .then(() => $state.go('pylonsIndex'));
  }

  vm.delete = pylonsDelete;

}

PylonsEditCtrl.$inject = ['Pylon', 'User', '$stateParams', '$state'];
function PylonsEditCtrl(Pylon, User, $stateParams, $state) {
  const vm = this;

  Pylon.get($stateParams).$promise.then((pylon) => {
    vm.pylon = pylon;
  });

  vm.users = User.query();

  function pylonsUpdate() {
    Pylon
      .update({id: vm.pylon.id, pylon: vm.pylon })
      .$promise
      .then(() => $state.go('pylonsShow', { id: vm.pylon.id }));
  }

  vm.update = pylonsUpdate;
}
