angular
  .module('project-4-api')
  .controller('PylonsIndexCtrl', PylonsIndexCtrl)
  .controller('PylonsNewCtrl', PylonsNewCtrl)
  .controller('PylonsShowCtrl', PylonsShowCtrl)
  .controller('PylonsEditCtrl', PylonsEditCtrl);

PylonsIndexCtrl.$inject = ['Pylon'];
function PylonsIndexCtrl(Pylon) {
  const vm = this;

  vm.all = Pylon.query();
}

PylonsNewCtrl.$inject = ['Pylon', 'User', '$state'];
function PylonsNewCtrl(Pylon, User, $state) {
  const vm = this;
  vm.pylon = {};
  vm.users = User.query();

  function pylonsCreate() {
    Pylon
      .save({ pylon: vm.pylon })
      .$promise
      .then(() => $state.go('pylonsIndex'));
  }

  vm.create = pylonsCreate;
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
