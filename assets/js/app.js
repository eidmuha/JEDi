// Declare Global Variables here



// Function List
// 
// Uses Zomato API to find surrounding restaurants using coordinates (lat, long)
function findRestaurantsAt(latitude, longitude) {
    var api_key = 'cd7f9f1eddfd3c773af2beab5727f5c9';

    $.ajax({
        url: 'https://developers.zomato.com/api/v2.1/geocode?' + 'lat=' + latitude + '&lon=' + longitude,
        method: 'GET',
        headers: {
            'user-key': api_key
        }

    }).then(function (response) {
        console.log(response);
    })
}

function findRestaurantsAroundMe() {
    var fields = 'status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,query';

    $.ajax({
        url: 'http://ip-api.com/json/?fields=' + fields,
        method: 'GET'
    }).then(function (response) {
        console.log(response);

        var latitude = response.lat;
        var longitude = response.lon;

        findRestaurantsAt(latitude, longitude);


    })
}

// Arguments Start Here
// 
findRestaurantsAroundMe();