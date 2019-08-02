var database = firebase.database();

var restoID = '';

var chatBoard = $('#chatBoard');
var messageBox = $('#chatInput');
var messageButton = $('#sendMessage');

// var commentsRef = database.ref('post-comments/' + postId);

database.ref().on('child_added', function(snap) {
  console.log(snap.val());
});

// commentsRef.on('child_changed', function(data) {
// });

database.ref().on('child_removed', function(snap) {
    console.log(snap.val());
});

messageButton.on('click', function(event){
    console.log("it's happening");
    // Prevent default form submission behavior
    event.preventDefault();

    database.ref().push({
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
          console.log('Message sent successfully!')
        }
      });
})
