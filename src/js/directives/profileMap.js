/* global google:ignore */

angular
  .module('project-4-api')
  .directive('profileMap', profileMap);


profileMap.$inject = ['$window'];
function profileMap($window) {
  const directive = {
    restrict: 'E',
    replace: true,
    template: '<div class="profile-map"></div>', //Better for small bits of html rather than creating a new file
    scope: {
      chosenLocation: '=',
      userPylons: '=',
      selectedPylon: '='
    },

    link($scope, element) {

      const map = new $window.google.maps.Map(element[0], {
        zoom: 12,
        center: {lat: 51.515559, lng: -0.071746},
        scrollwheel: false
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

      let pylonMarkers = [];

      function removeMarkers(markers) {
        markers.forEach((marker) => {
          marker.setMap(null);
        });

        return [];
      }

      function addPylonMarkers() {
        pylonMarkers = removeMarkers(pylonMarkers);
        $scope.userPylons.forEach((pylon) => {
          const marker = new $window.google.maps.Marker({
            position: { lat: parseFloat(pylon.listing.lat), lng: parseFloat(pylon.listing.lng) },
            map: map,
            animation: google.maps.Animation.DROP
          });

          pylonMarkers.push(marker);

          google.maps.event.addListener(marker, 'click', function () {
            $scope.selectedPylon = pylon;
            $scope.$apply();
          });
        });
      }

      addPylonMarkers();

    }
  };

  return directive;
}
