
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
// map center to specific coordinates
var center;
// map options, eg. zoom level etc.
var options;


// Initialize and add the map
function initMap() {

  var infowindow = new google.maps.InfoWindow();

  options = {
    zoom: 16,
    center: { lat: -37.8136, lng: 144.9631 },
    mapTypeId: 'roadmap',
    styles: myStyles,
  };

  var mapDiv = $("#map")[0];

  // Creates new map
  map = new google.maps.Map(mapDiv, options);

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
        var service = new google.maps.places.PlacesService(map);

        service.nearbySearch({
          location: center,
          radius: 2000,
          type: ['restaurant']
        }, callback);

      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }


  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      createMarker(results);
    }
  }

  function createMarker(places) {
    var markers = [];

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];
    var content = ""

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
      
      content = '<b>' + place.name + '</b><br><p>' + place.vicinity + '</p><h5><a href="#" class="float-right" data-id = ' + place.place_id + '>More <i class="fa fa-angle-double-right"></i></h5></a>';
      // redirect to the resturant details page
      google.maps.event.addListener(markers[i], "click", function () {
        infowindow.setContent(content);
        infowindow.open(map, this);
        // window.location.href='about-restaurant.html?place_id='+place.place_id;
      });


      map.fitBounds(bounds);

    });//foreach
  }//createMarker

}//initMap

// Make user sign out when they click on the sign out Button
$("#signOutButton").on("click", function () {
  // Sign out from Firebase
  firebase.auth().signOut();
});

// click on each more>> link, (:)
$(document).on("click", "[data-id]", function () {
  window.location.href = 'about-restaurant.html?place_id=' + $(this).attr("data-id");
});