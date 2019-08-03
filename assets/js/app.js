var key = "AIzaSyBXWH8-f9n91Qeuo_2S9MBM-iV6wf8Odzo";

var myCurentLocation = [];

var myStyles = [
  {
    featureType: "poi",

    stylers: [{ visibility: "off" }]
  }
];

var searchInput = "resturants";

$(document).on("click", "#submit", function() {
  searchInput = $("#place-id").val();
  initMap();
});

// Initialize and add the map
function initMap() {
  var center = new google.maps.LatLng(
    myCurentLocation[0].lat.toFixed(3),
    myCurentLocation[0].lon.toFixed(3)
  );
  var options = {
    zoom: 15,
    center: center,
    styles: myStyles,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var restIcon = "http://maps.google.com/mapfiles/ms/micons/restaurant.png";

  var mapDiv = $("#map")[0];

  // Creates new map
  var map = new google.maps.Map(mapDiv, options);

  var infowindow = new google.maps.InfoWindow();

  var marker = new google.maps.Marker({
    position: center,
    map: map
  });

  var request = {
    location: center,
    radius: "800",
    type: [searchInput]
  };

  console.log(searchInput);
  var service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, callback);

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let index = 0; index < results.length; index++) {
        createMarker(results[index]);
      }
    }
  }

  function createMarker(place) {
    console.log(place);
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      position: placeLoc,
      map: map,
      icon: restIcon
    });

    google.maps.event.addListener(marker, "click", function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }
}

function findRestaurantsAroundMe() {
  var la;
  var lo;
  // if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    myCurentLocation.push({
      lat: position.coords.latitude,
      lon: position.coords.longitude
    });
    la = myCurentLocation[0].lat.toFixed(6);
    lo = myCurentLocation[0].lon.toFixed(6);

    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      la +
      "," +
      lo +
      "&key=" +
      key;

    console.log(url);

    // AJAX API Call
    $.ajax({
      // Query & Parameters
      url: url,
      method: "GET"
    }).then(function(response) {
      initMap();
    });
  });
  // }
}
// Arguments Start Here
// findRestaurantsAroundMe();

function findRestaurantDetail(placeId) {
  var map = new google.maps.Map($("#map")[0]);

  var service = new google.maps.places.PlacesService(map);

  service.getDetails(
    {
      placeId,
      fields: [
        "name",
        "formatted_address",
        "formatted_phone_number",
        "rating",
        "reviews"
      ]
    },
    function(place, status) {
      console.log({ place, status });
      console.log(place);
      $(".display-4").append(place.name);
      $(".lead").append(place.formatted_address);
      $(".rating").append("<h4>Rating</h4>" + place.rating);
      var reviews = place.reviews;
      console.log(reviews);
      for (var i = 0; i < reviews.length; i++) {
        var review_text = reviews[i].text;
        var review = $("<li>").text(review_text);
        var author = reviews[i].author_name;
        $(".reviews").append(review);
      }
    }
  );
}

findRestaurantDetail("ChIJR4ni6PVp1moRh7bVf_HhvM8");
