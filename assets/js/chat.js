var database = firebase.database();

var restaurantName = 'Blue Barracudas';

var chatBoard = $('#messageBoard');
var messageBox = $('#chatInput');
var messageButton = $('#sendMessage');

// Function List
// 
// Renders CHat
function RenderChat(snap) {
    console.log('key' + snap.ref.key)
    var newMessage = $('<p>');
    newMessage.text(snap.val().message);

    chatBoard.append(newMessage);

}


// When page is loaded
$(document).ready(function () {

    // Arguments begin here
    console.log('starting up');
    var ref = database.ref('/' + restaurantName).orderByChild('dateAdded');

    ref.once('value', function (snap) {
        console.log(snap.val());
        RenderChat(snap);
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
        database.ref('/' + restaurantName).on('child_added', function (snap) {
            console.log(snap.val());
            console.log('child added');

            // var newMessage = $('<p>');
            // newMessage.text(snap.val().message);
            // chatBoard.append(newMessage);
            RenderChat(snap);
        });


        //   database.ref('/'+restaurantName).on('value', function(snap) {
        //       console.log(snap.val());
        //   });
    })


});