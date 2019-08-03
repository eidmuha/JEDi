var database = firebase.database();

var restaurantName = 'Blue Barracudas';

var chatBoard = $('#messageBoard');
var messageBox = $('#chatInput');
var messageButton = $('#sendMessage');

// Function List
// 
// Renders Message onto chatboard
function RenderMessage(snap) {

    console.log('Rendering Msg');
    console.log(snap);

    // Declare new element variables
    var chatBubble = $('<li>');
    var newMessage = $('<span>');
    var timeAdded = $('<span>');

    newMessage.addClass('align-left');
    timeAdded.addClass('align-right chatTimeStamp');

    chatBubble.addClass('chatBubble');

    var year = moment(new Date(snap.dateAdded)).year();
    var month = moment(new Date(snap.dateAdded)).month();
    var day = moment(new Date(snap.dateAdded)).date();

    

    console.log('Year: '+year+'Month: '+month+'Day: '+day);

    // Assign snap values for message
    newMessage.text(snap.message);
    timeAdded.text(new Date(snap.dateAdded));

    // Append both message and time added to the chatbubble
    chatBubble.append(newMessage);
    chatBubble.append(timeAdded);

    // Append the chat bubble to the board
    chatBoard.append(chatBubble);
}


// When page is loaded
$(document).ready(function () {

    // Arguments begin here
    console.log('starting up');
    var ref = database.ref('/' + restaurantName).orderByChild('dateAdded');

    // Take a snapshot and build the message board from the snap
    ref.once('value', function (snap) {
        console.log('Once function');
        // Clear current board
        chatBoard.empty();

        // With returned snapshot, iterate through each key passing to render message
        for (key in snap.val()) {
            // Use RenderMessage to print messages
            RenderMessage(snap.val()[key]);
        }
    });

    // Event listener
    messageButton.on('click', function (event) {
        // Prevent default form submission behavior
        event.preventDefault();

        // Push a new message to the restaurantName reference
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
                messageBox.val('');
            }
        });

    })
    //   Database listeners
    // 
    // When a child is added within the restaurant database reference
    // .limitToLast(1)
    database.ref('/' + restaurantName)
        .endAt()
        .limitToLast(1)
        .on('child_added', function (snap) {
            console.log('child added');
            console.log({
                snap
            });


            // Render the child that was added 
            RenderMessage(snap.val());
        });

});