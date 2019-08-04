var database = firebase.database();

var restaurantName = 'Blue Barracudas';

var chatBoard = $('#messageBoard');
var messageBox = $('#chatInput');
var messageButton = $('#sendMessage');
var signOutButton = $('#signOutButton');
var alertModal = $('#alertModal');

// Function List
// 
// Renders Message onto chatboard
function RenderMessage(snap) {

    console.log('Rendering Msg');

    // Declare new element variables
    var chatBubble = $('<li>');
    var messageSpace = $('<row>');
    var newMessage = $('<span>');
    var timeAdded = $('<span>');

    // Message CSS
    messageSpace.addClass('messageSpace');

    newMessage.addClass('align-left');
    timeAdded.addClass('align-right chatTimeStamp');

    chatBubble.addClass('chatBubble');

    // Assign snap values for message
    newMessage.text(snap.message);
    timeAdded.text(new Date(snap.dateAdded));

    // Append both message and time added to the chatbubble
    chatBubble.append(newMessage);
    chatBubble.append(timeAdded);

    // Append the chat bubble to the board
    chatBoard.append(chatBubble);
}


// Event listeners
// 
// Message Button 
messageButton.on('click', function (event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // If the user is logged in, & has a user id then allow them to message
    if (accountDetails.uid != null) {
        // Push a new message to the restaurantName reference
        database.ref('/' + restaurantName).push({
            // Push the message
            message: messageBox.val(),
            // & a timestamp for ordering later
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
            // User ID
            userID: accountDetails.uid
        }, function (error) {
            if (error) {
                // The write failed...
                console.log(error);
            } else {
                // Data saved successfully!
                console.log('Message sent successfully!');
                // Clear message box
                messageBox.val('');
            }
        });
        // Failed to message due to lack of user credentials
    } else {
        console.log('Failed to retrieve uid');
        // TODO: make a MODAL that will inform the user why they couldn't login with a close button
        // 
        alertModal.show();

    }


})
//   Database listeners
// 
// When a child is added within the restaurant database reference
database.ref('/' + restaurantName)
    .endAt()
    // Limit to the last item
    .limitToLast(1)
    // When child is added
    .on('child_added', function (snap) {
        console.log('child added');

        // Render the child that was added 
        RenderMessage(snap.val());
    });

// Make user sign out when they click on the sign out Button
signOutButton.on('click', function () {
    // Sign out from Firebase
    firebase.auth().signOut();
});

// Event listener for all button clicks in Modal: Close modal 
$('.modal button').on('click', function () {

    // Hide modal
    alertModal.hide();
});

// Arguments begin here
// 
// When page is loaded
$(document).ready(function () {

    var ref = database.ref('/' + restaurantName).orderByChild('dateAdded');

    // Take a snapshot and build the message board from the snap
    ref.once('value', function (snap) {
        // Clear current board
        chatBoard.empty();

        // With returned snapshot, iterate through each key passing to render message
        for (key in snap.val()) {
            // Use RenderMessage to print messages
            RenderMessage(snap.val()[key]);
        }
    });



});