// Declare Global Variables here

// Function List
// 
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
        console.log(response);
    })
}

// Use IP-API to find user coordinates and use to find surrounding restaurants
function findRestaurantsAroundMe() {
    // String of concatenated fields to return from API call
    var fields = 'status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,query';

    // AJAX API Call
    $.ajax({
        // Query & Parameters
        url: 'http://ip-api.com/json/?fields=' + fields,
        method: 'GET'

    }).then(function (response) {
        console.log(response);

        // Assign geolocation values from response to variables
        var latitude = response.lat;
        var longitude = response.lon;

        // Use coordinates to find nearby restaurants
        findRestaurantsAt(latitude, longitude);
    })
}

// Arguments Start Here
// 
findRestaurantsAroundMe();