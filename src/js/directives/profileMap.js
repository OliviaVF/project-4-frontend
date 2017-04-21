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
      center: '=',
      chosenLocation: '=',
      userPylons: '=',
      selectedListing: '=',
      filteredPylons: '='
    },

    link($scope, element) {

      let radius = null;
      let pylonMarkers = [];
      const slider = document.getElementById('slider');

      const map = new $window.google.maps.Map(element[0], {
        zoom: 12,
        center: {lat: 51.515559, lng: -0.071746},
        scrollwheel: false
      });

      function getLocation() {
        const locationMarker = new $window.google.maps.Marker({
          map: map,
          icon: '/images/me.png',
          animation: google.maps.Animation.DROP
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            const circleUser = new google.maps.Circle({
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 1.5,
            fillColor: '#0000FF',
            fillOpacity: 0.1,
            map: map,
            center: pos,
            radius: radius
          });

          slider.onchange = function() {
            radius = parseFloat(this.value);
            circleUser.setRadius(radius);
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

      function removeMarkers(markers) {
        markers.forEach((marker) => {
          marker.setMap(null);
        });

        return [];
      }

      function addPylonMarkers(sortedPylons) {
        console.log(sortedPylons);
        pylonMarkers = removeMarkers(pylonMarkers);
        sortedPylons.forEach((pylonArray) => {
          console.log('number', pylonArray.length);

          const number = pylonArray.length;
          console.log(number);
          const pylonImage = number > 10 ? '10-plus.png' : `${number}.png`;
          console.log(pylonImage);

          const marker = new $window.google.maps.Marker({
            position: { lat: parseFloat(pylonArray[0].listing.lat), lng: parseFloat(pylonArray[0].listing.lng) },
            map: map,
            animation: google.maps.Animation.DROP,
            icon: `/images/${pylonImage}`
          });

          pylonMarkers.push(marker);

          google.maps.event.addListener(marker, 'click', function () {
            $scope.selectedListing = pylonArray[0].listing;
            $scope.$apply();
          });
        });
      }

      function sortPylons() {
        const sortedPylons = []; // eventually an array of arrays
        $scope.filteredPylons.forEach((pylon) => {
          let pushed = false;

          sortedPylons.forEach((pylonArray) => {

            if (pylon.listing.id === pylonArray[0].listing.id) {
              pylonArray.push(pylon);
              pushed = true;
            }

          });

          if (!pushed) sortedPylons.push([pylon]);

        });

        addPylonMarkers(sortedPylons);
      }

      $scope.$watch('filteredPylons', (newVal) => {
        if(newVal && newVal.length) sortPylons();
      });


    }
  };

  return directive;
}
