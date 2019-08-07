// Assign global variables
var accountDetails = {};
var profileSource = '';

// Function List
// 
function changeDisplayPicture(profileSource) {
    var singedInLocation = $("#rightbar");
    // Assign variables
    var profileSpot = $('#brandProfileSpot');
    // Create new image jquery element
    var profilePic = $('<img>');
    // Give Bootstrap classes
    profilePic.attr('class', "d-inline-block align-top");
    // Set image source from input
    profilePic.attr('src', profileSource);
    // Set width and height parameters
    profilePic.attr('width', '30');
    profilePic.attr('height', '30');
    profilePic.attr('id', 'profilePicture');

    // Append to profile spot
    
    singedInLocation.prepend(profileSpot.prepend(profilePic));
}

// On load of app, this function will be called
initApp = function () {
    // On change of an authentication state
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in. Assign all variables
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            user.getIdToken().then(function (accessToken) {
                // Use Display name in sign in status. Change text button to sign out
                document.getElementById('sign-in-status').innerHTML = 'Signed in as: <b id="dname">' + displayName + '</b>';

                // Display updated status of button
                document.getElementById('sign-in').textContent = 'Sign out';
                // Make button visible
                $('signOutButton').attr('class', 'btn btn-primary mb-2 btn-sm');
                $('.firebaseui-list-item button').hide();



                // Create object with user details and assign: accountDetails
                accountDetails = {
                    displayName: displayName,
                    email: email,
                    emailVerified: emailVerified,
                    phoneNumber: phoneNumber,
                    photoURL: photoURL,
                    uid: uid,
                    accessToken: accessToken,
                    providerData: providerData
                };

                // Change display picture
                changeDisplayPicture(photoURL);

            });
        } else {
            // Hide the SignOut button and empty the profile area
            $('#signOutButton').hide();
            $('#profilePicture').remove();
            $('.firebaseui-list-item button').show();



            // User is signed out. Change text elements as required. Make account details null
            console.log('User signed out');
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            accountDetails = 'null';
        }
    }, function (error) {
        console.log(error);
    });
};

// When window loads, run initApp
window.addEventListener('load', function () {
    initApp();
});