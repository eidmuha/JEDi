function findRestaurantDetail(placeId) {
  var map = new google.maps.Map($("#map")[0]);

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
        "reviews"
      ]
    },
    function(place, status) {
      console.log({ place, status });
      console.log(place);
      $(".display-4").append(place.name);
      $(".lead").append(place.formatted_address);
      if (place.rating) {
        $(".rating").append("<h4>Rating</h4>" + place.rating);
      }
      var reviews = place.reviews;
      //console.log(reviews);
      if (reviews) {
        for (var i = 0; i < reviews.length; i++) {
          var review_text = reviews[i].text;
          var review = $("<li>").text(review_text);
          var author = reviews[i].author_name;
          $(".reviews").append(review);
        }
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
