var key = "AIzaSyBXWH8-f9n91Qeuo_2S9MBM-iV6wf8Odzo";
// custom styles that could be applied to the map
var myStyles = [
  {
    featureType: "poi",

    stylers: [{ visibility: "off" }]
  }
];
// variable that holds the map object
var map;
// google services to fine the nearby locations
var service;
// request object that holds the areas to find
var request;
// info window poped up when clicked on the marker
var infowindow;
// map center to specific coordinates
var center;
// map options, eg. zoom level etc.
var options;

 
// Initialize and add the map
function initMap() {
  options = {
    zoom: 16,
    center: { lat: -37.8136, lng: 144.9631 },
    mapTypeId: 'roadmap',
    styles: myStyles,
  };

  var mapDiv = $("#map")[0];

  // Creates new map
  map = new google.maps.Map(mapDiv, options);

  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });


  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // create marker for the current location of the device
        var marker = new google.maps.Marker({
          position: center,
          map: map
        });
        // make the map point to this center
        map.setCenter(center);
        myFunction()
      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  function myFunction() {

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function (marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      // The LatLngBounds class represents a rectangle in geographical coordinates. 
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place, i) {
        
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        var icon = {
          url: place.icon,
          size: new google.maps.Size(100, 100),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));


        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        // redirect to the resturant details page
        google.maps.event.addListener(markers[i], "click", function () {
          window.location.href='about-restaurant.html?place_id='+place.place_id;
        });

      });
      // 
      map.fitBounds(bounds);

    });


  }

}


function setRating(placeRating) {

  let stars = document.querySelectorAll('.star');

  stars.forEach(function (star, index) {
    // console.log("index: "+index + ", rating: "+ placeRating)
    if (index <= placeRating) {
      star.classList.add("rated");
    }
  });


}

// click on each more>> link, (:)
// $(document).on("click", "[data-id]", function () {
//   alert($(this).attr("data-id"));
// });
