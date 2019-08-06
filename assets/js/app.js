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
// holds the rest icon
var restIcon = "http://maps.google.com/mapfiles/ms/micons/restaurant.png";
// what you want to search, this holds the value from the user input
var searchInput;

// when clicked on the submit button, initialize the map again
$(document).on("click", "#submit", function() {
  searchInput = $("#place-id").val();
  initMap();
});

// Initialize and add the map
function initMap() {
  // searchInput = $("#place-id").val().trim();
  searchInput = "resturants";

  options = {
    zoom: 16,
    center: { lat: -34.397, lng: 150.644 },
    styles: myStyles,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var mapDiv = $("#map")[0];

  // Creates new map
  map = new google.maps.Map(mapDiv, options);

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
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

        // request from the user, what to find
        request = {
          location: center,
          radius: "800",
          type: [searchInput]
        };

        infowindow = new google.maps.InfoWindow();

        service = new google.maps.places.PlacesService(map);

        service.nearbySearch(request, callback);
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // call back function that creates marker for each surrounding locations
  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let index = 0; index < results.length; index++) {
        createMarker(results[index]);
      }
    }
  }

  // create marker for the surrounding areas requested
  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      position: placeLoc,
      map: map,
      icon: restIcon
    });

    // content to be displayed on the info window
    var content =
      "<h4>" +
      place.name +
      '</h4><br><h5><a href="about-restaurant.html?place_id=' +
      place.place_id +
      '" class="float-right" data-id = ' +
      place.place_id +
      '>More <i class="fa fa-angle-double-right"></i></h5></a>';

    // Eventlistener for click on the requested marker
    google.maps.event.addListener(marker, "click", function() {
      infowindow.setContent(content);
      infowindow.open(map, this);
    });
  }
}

// click on each more>> link, (:)
$(document).on("click", "[data-id]", function() {
  //alert($(this).attr("data-id"));
});
