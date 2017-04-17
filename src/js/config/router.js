angular
  .module('project-4-api')
  .config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'js/views/static/home.html'
    })
    .state('pylonsIndex', {
      url: '/pylons',
      templateUrl: 'js/views/pylons/index.html',
      controller: 'PylonsIndexCtrl as pylonsIndex'
    })
    .state('pylonsNew', {
      url: '/pylons/new',
      templateUrl: 'js/views/pylons/new.html',
      controller: 'PylonsNewCtrl as pylonsNew'
    })
    .state('pylonsShow', {
      url: '/pylons/:id',
      templateUrl: 'js/views/pylons/show.html',
      controller: 'PylonsShowCtrl as pylonsShow'
    })
    .state('pylonsEdit', {
      url: '/pylons/:id/edit',
      templateUrl: 'js/views/pylons/edit.html',
      controller: 'PylonsEditCtrl as pylonsEdit'
    })
    .state('usersIndex', {
      url: '/users',
      templateUrl: 'js/views/users/index.html',
      controller: 'UsersIndexCtrl as usersIndex'
    })
    .state('usersShow', {
      url: '/users/:id',
      templateUrl: 'js/views/users/show.html',
      controller: 'UsersShowCtrl as usersShow'
    })
    .state('usersEdit', {
      url: '/users/:id/edit',
      templateUrl: 'js/views/users/edit.html',
      controller: 'UsersEditCtrl as usersEdit'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'js/views/auth/login.html',
      controller: 'AuthCtrl as auth'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'js/views/auth/register.html',
      controller: 'AuthCtrl as auth'
    });

  $urlRouterProvider.otherwise('/');
}
