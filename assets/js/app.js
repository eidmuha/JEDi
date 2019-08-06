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

var ratings = {}



// when clicked on the submit button, initialize the map again
// $(document).on("click", "#submit", function() {
//   searchInput = $("#place-id").val();
//   initMap();
// });

// Initialize and add the map
function initMap() {
  searchInput = "coffee shop";

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

        // request from the user, what to find
        // request = {
        //   location: center,
        //   radius: "800",
        //   type: ['school']
        // };

        // infowindow = new google.maps.InfoWindow();

        // service = new google.maps.places.PlacesService(map);

        // service.nearbySearch(request, callback);
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

  // call back function that creates marker for each surrounding locations
  // function callback(results, status) {
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     for (let index = 0; index < results.length; index++) {
  //       // createMarker(results[index]);
  //     }
  //   }
  // }

  // create marker for the surrounding areas requested
  /*
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
    google.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(content);
      infowindow.open(map, this);
    });
  }*/


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
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place, i) {
        // console.log(place)
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

        var request = {
          placeId: place.place_id // example: ChIJN1t_tDeuEmsRUsoyG83frY4
        };

        var service = new google.maps.places.PlacesService(map); // map is your map object

        service.getDetails(request, function (place, status) {



          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (let index = 0; index < place.reviews.length; index++) {
              // console.log(place.reviews[index].author_name)

              var placeRating = parseInt(place.reviews[index].rating);

              ratings[place.reviews[index].author_name] = placeRating;
              // ratings.stars = ratingDiv;


              var ratingDiv = `<div class="stars" data-rating="` + placeRating + `">
                              <span class="star">&nbsp;</span>
                              <span class="star">&nbsp;</span>
                              <span class="star">&nbsp;</span>
                              <span class="star">&nbsp;</span>
                              <span class="star">&nbsp;</span>
                              </div>`;


           
                $('<div class="carousel-item"><img class= "pl-5" src="' + place.reviews[index].profile_photo_url + '" width="20%"> : ' + place.reviews[index].author_name + " : " + ratingDiv + '  </div>').appendTo('.carousel-inner');
                $('<li data-target="#carousel" data-slide-to="' + index + '"></li>').appendTo('.carousel-indicators')
                setRating(placeRating)


              // $('<div class="item"><img src="'+place.reviews[index].profile_photo_url+'"><div class="carousel-caption"></div>   </div>').appendTo('.carousel-inner');
              // $('<li data-target="#carousel-example-generic" data-slide-to="'+index+'"></li>').appendTo('.carousel-indicators')              
            }
            $('.carousel-item').first().addClass('active');
            $('.carousel-indicators > li').first().addClass('active');
            $('#carousel').carousel();

            // console.log(ratings)



          }
        });

        // console.log(markers)

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        google.maps.event.addListener(markers[i], "click", function () {
          // console.log(place)
          /*         var mapDiv = $("#resturantMap")[0];
                   var resturantMap = new google.maps.Map(mapDiv, options);
         
                   var marker = new google.maps.Marker({
                     map: resturantMap,
                     place: {
                       placeId: place.placeId,
                       location: place.geometry.location
                     }
                   });
         
                   
         */




          var photos = place.photos;
          if (!photos) {
            return;
          } else {

            $("#resturantImg").attr('src', place.photos[0].getUrl())
          }


          $(".modal-title").text(place.name)
          $('.modal').modal('show');
        });

      });
      map.fitBounds(bounds);

    });//


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
$(document).on("click", "[data-id]", function () {
  alert($(this).attr("data-id"));
});
