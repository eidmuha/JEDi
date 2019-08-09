var restoInfo = { name: "", id: "id" };

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
      // console.log({ place, status });
      // console.log(place);
      // Assign place information to a global variable for the Chat Board
      restoInfo.name = place.name;

      $(".display-4").append(place.name);
      $(".lead").append(place.formatted_address);
      $(".contactdetails").append(place.formatted_phone_number);
      if (place.rating) {
        $(".stars").attr("data-rating", place.rating);
      }
      $(".website").append(
        "<a href='" + place.website + "' class='link'>About Us</a>"
      );
      // console.log(place.website);
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
            "<div class='centered-content border--tan p2'><div class='align--left'><img class='quote mb1' src='assets/images/quote.png' /></div><p>" +
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
      if (photos.length > 0) {
        for (var l = 0; l < photos.length; l++) {
          $(".gallery").append("<img src='" + place.photos[l].getUrl() + "'/>");
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

// Assign the placeID to restoInfo
restoInfo.id = placeID;

// convert number into star
$.fn.stars = function() {
  return $(this).each(function() {
    var rating = $(this).data("rating");
    var numStars = $(this).data("numStars");
    var fullStar = new Array(Math.floor(rating + 1)).join(
      '<i class="fa fa-star"></i>'
    );
    var halfStar =
      rating % 1 !== 0 ? '<i class="fa fa-star-half-empty"></i>' : "";
    var noStar = new Array(Math.floor(numStars + 1 - rating)).join(
      '<i class="fa fa-star-o"></i>'
    );
    $(this).html(fullStar + halfStar + noStar);
  });
};

//slick slider for reviews & gallery
$(window).on("load", function() {
  $(".reviews").slick({
    arrows: false,
    autoplay: true
  });
  $(".gallery").slick({
    arrows: false,
    autoplay: true
  });
  $(".stars").stars();
});
