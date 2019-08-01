// Declare Global Variables here
// The veriable that holds the coordinates
var coord = [];
// Function List

// Uses Zomato API to find surrounding restaurants using coordinates (lat, long)
function findRestaurantsAt(latitude, longitude) {
    // Declare API key variable
    var api_key = 'cd7f9f1eddfd3c773af2beab5727f5c9';

    // API Call to Zomato
    $.ajax({
        // Query & Paremeters
        url: 'https://developers.zomato.com/api/v2.1/geocode?' + 'lat=' + latitude + '&lon=' + longitude,
        method: 'GET',
        // Use headers for authentication
        headers: {
            'user-key': api_key
        }

    }).then(function (response) {
        // console.log(response);
        initMap()
    })
}

// Initialize and add the map
function initMap() {
    // get my location coordinates
    var myLocation = {lat: coord[0].lat, lng: coord[0].lng};
    // The map, centered at the given location
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 20, center: myLocation});
    // The marker, positioned at the given location
    var marker = new google.maps.Marker({position: myLocation, map: map});
  }

// Use IP-API to find user coordinates and use to find surrounding restaurants
function findRestaurantsAroundMe() {
    // String of concatenated fields to return from API call
    // var fields = 'status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,query';
    var api_key = '4dc35c50ed1644efa6d3364edcfb582c';

    // AJAX API Call
    $.ajax({
        // Query & Parameters
        url: 'https://api.ipgeolocation.io/ipgeo?apiKey=' + api_key,
        method: 'GET'

    }).then(function (response) {
        console.log(response);

        // Assign geolocation values from response to variables
        var latitude = parseInt(response.latitude);
        var longitude = parseInt(response.longitude);

        // push the location in an array, for later use
        coord.push({lat:latitude, lng: longitude})
        
        // Use coordinates to find nearby restaurants
        findRestaurantsAt(latitude, longitude);

    })
}

// Arguments Start Here
// 
findRestaurantsAroundMe();