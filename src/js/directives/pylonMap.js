angular
   .module('project-4-api')
   .directive('pylonMap', pylonMap);

pylonMap.$inject = ['$window', 'MAP_STYLES'];
function pylonMap($window, MAP_STYLES) {
 const directive = {
   restrict: 'E',
   replace: true,
   template: '<div class="pylon-map"></div>', //Better for small bits of html rather than creating a new file
   scope: {
     pylon: '='
   },

   link($scope, element) {

     const map = new $window.google.maps.Map(element[0], {
       zoom: 12,
       center: {lat: $scope.pylon.listing.lat, lng: $scope.pylon.listing.lng},
       scrollwheel: false,
       styles: MAP_STYLES
     });

     const pylonMarker = new $window.google.maps.Marker({
       map: map,
       animation: google.maps.Animation.DROP,
       position: {lat: $scope.pylon.listing.lat, lng: $scope.pylon.listing.lng},
       icon: '/images/pylon.png'
     });

   }
 };
 return directive;
}
