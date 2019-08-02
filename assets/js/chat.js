var database = firebase.database();

var restaurantName = 'Blue Barracudas';

var chatBoard = $('#chatBoard');
var messageBox = $('#chatInput');
var messageButton = $('#sendMessage');


// When page is loaded
$(document).ready(function(){



    // Event listener
    messageButton.on('click', function(event){
        // Prevent default form submission behavior
        event.preventDefault();
    
        database.ref('/'+restaurantName).push({
            // Push the message
            message: messageBox.val(),
            // & a timestamp for ordering later
            dateAdded: firebase.database.ServerValue.TIMESTAMP
          }, function(error) {
            if (error) {
              // The write failed...
              console.log(error);
            } else {
              // Data saved successfully!
              console.log('Message sent successfully!');
    
            }
          });


        //   Database listeners
        database.ref('/'+restaurantName).on('child_added', function(snap) {
            console.log(snap.val());
          
            var newMessage = $('<p>');
            newMessage.text(snap.val().message);
          
            chatBoard.append(newMessage);
          });
          
          
          database.ref('/'+restaurantName).on('value', function(snap) {
              console.log(snap.val());
          });
    })


});
