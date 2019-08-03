var accountDetails = {};
var profileSource = '';

initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            user.getIdToken().then(function (accessToken) {
                // Use Display name in sign in status. Change text button to sign out
                document.getElementById('sign-in-status').textContent = 'Signed in as: '+displayName;

                document.getElementById('sign-in').textContent = 'Sign out';
                $('signOutButton').attr('class', 'btn btn-primary mb-2');


                // accountDetails
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

                console.log(accountDetails);

                // Build Navbar details
                profileSource = accountDetails.photoURL;

            });
        } else {
            // Hide the SignOut
        $('#signOutButton').addClass('hide');

            // User is signed out.
            console.log('User signed out');
            document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            document.getElementById('account-details').textContent = 'null';
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp();
});