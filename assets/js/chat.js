var database = firebase.database();

var restaurantName = 'Blue Barracudas';

var chatBoard = $('#messageBoard');
var messageBox = $('#chatInput');
var messageButton = $('#sendMessage');

// Function List
// 
// Renders CHat
function RenderMessage(snap) {

    console.log('Rendering Msg');
    console.log(snap);

    var newMessage = $('<p>');

    newMessage.text(snap.message);
    chatBoard.append(newMessage);
}


// When page is loaded
$(document).ready(function () {

    // Arguments begin here
    console.log('starting up');
    var ref = database.ref('/' + restaurantName).orderByChild('dateAdded');

    ref.once('value', function (snap) {
        console.log('Once function');

        // With returned snapshot, iterate through
        for (key in snap.val()) {
            console.log(snap.val()[key]);
            RenderMessage(snap.val()[key]);
        }
    });

    // Event listener
    messageButton.on('click', function (event) {
        // Prevent default form submission behavior
        event.preventDefault();

        database.ref('/' + restaurantName).push({
            // Push the message
            message: messageBox.val(),
            // & a timestamp for ordering later
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        }, function (error) {
            if (error) {
                // The write failed...
                console.log(error);
            } else {
                // Data saved successfully!
                console.log('Message sent successfully!');

            }
        });


        //   Database listeners
        // 
        // When a child is added within the restaurant database reference
        database.ref('/' + restaurantName).on('child_added', function (snap) {
            console.log(snap.val());
            console.log('child added');

            RenderMessage(snap.val());
        });


        //   database.ref('/'+restaurantName).on('value', function(snap) {
        //       console.log(snap.val());
        //   });
    })


});