function findRestaurantDetail(placeId) {
  var map = new google.maps.Map($("#res-detail")[0]);

  var service = new google.maps.places.PlacesService(map);

  // service = new google.maps.places.PlacesService(map);
  service.getDetails(
    {
      placeId,
      fields: [
        "name",
        "formatted_address",
        "formatted_phone_number",
        "rating",
        "reviews",
        "opening_hours",
        "photo",
        "website",
        "geometry"
      ]
    },
    function(place, status) {
      console.log({ place, status });
      console.log(place);
      $(".display-4").append(place.name);
      $(".lead").append(place.formatted_address);
      $(".contactdetails").append(place.formatted_phone_number);
      if (place.rating) {
        $(".rating").append("<h4>Rating</h4>" + place.rating);
      }
      $(".website").append(
        "<a href='" + place.website + "' class='link'>About Us</a>"
      );
      console.log(place.website);
      var hours = place.opening_hours.weekday_text;
      if (hours) {
        $(".hours").prepend("<h4>Hours</h4>");
        for (var k = 0; k < hours.length; k++) {
          $(".hours").append(
            "<p>" + place.opening_hours.weekday_text[k] + "</p>"
          );
        }
      }
      var reviews = place.reviews;
      if (reviews) {
        for (var i = 0; i < reviews.length; i++) {
          $(".reviews").append(
            "<div class='grid-column span-12 mt1'><div class='square'><div class='aspect-ratio__content centered-content border--tan p2'><div class='align--left'><img class='quote mb1' src='assets/images/quote.png' /></div><p> " +
              reviews[i].text +
              "</p><p class='italic author'>– " +
              reviews[i].author_name +
              "</p></div></div></div>"
          );
        }
      }
      var photos = place.photos;
      if (!photos) {
        return;
      } else {
        $(".resturantImg").css(
          "background",
          "url(" + place.photos[0].getUrl() + ")"
        );
        //$("#resturantImg").attr("src", place.photos[0].getUrl());
      }
    }
  );
}

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
};
var placeID = getUrlParameter("place_id");

findRestaurantDetail(placeID);
