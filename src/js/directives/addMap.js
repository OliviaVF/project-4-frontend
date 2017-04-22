angular
   .module('project-4-api')
   .directive('addMap', addMap)
   .directive('autocomplete', autocomplete);

addMap.$inject = ['$window', 'MAP_STYLES'];
function addMap($window, MAP_STYLES) {
 const directive = {
   restrict: 'E',
   replace: true,
   template: '<div class="add-map"></div>', //Better for small bits of html rather than creating a new file
   scope: {
     chosenLocation: '='
   },

   link($scope, element) {

     const map = new $window.google.maps.Map(element[0], {
       zoom: 12,
       center: {lat: 51.515559, lng: -0.071746},
       scrollwheel: false,
       styles: MAP_STYLES
     });

     const pylonMarker = new $window.google.maps.Marker({
       map: map,
       animation: google.maps.Animation.DROP
     });

     function getLocation() {

       const locationMarker = new $window.google.maps.Marker({
         map: map,
         animation: google.maps.Animation.DROP
       });

       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition((position) => {
           var pos = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
           };

           locationMarker.setPosition(pos);
           map.setCenter(pos);
         }, function() {
           handleLocationError(true, locationMarker, map.getCenter());
         });
       } else {
       // Browser doesn't support Geolocation
         handleLocationError(false, locationMarker, map.getCenter());
       }

       function handleLocationError(browserHasGeolocation, infoWindow, pos) {
         locationMarker.setPosition(pos);
       }

     }

      getLocation();

      $scope.$watch('chosenLocation', () => {
        if($scope.chosenLocation && $scope.chosenLocation.lat && $scope.chosenLocation.lng) {
          pylonMarker.setPosition($scope.chosenLocation);
          map.setCenter($scope.chosenLocation);
        }
      });

   }
 };
 return directive;
}

autocomplete.$inject = ['$window'];
function autocomplete($window) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      lat: '=',
      lng: '=',
      chooseListing: '&',
      geometry: '='
    },

    link: function($scope, element, attrs, model) {
      const options = {
        types: []
      };

      const autocomplete = new $window.google.maps.places.Autocomplete(element[0], options);


      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        $scope.geometry = place.geometry.location.toJSON();
        model.$setViewValue(element.val());
        $scope.chooseListing({ place });
     });
   }
 };
}
