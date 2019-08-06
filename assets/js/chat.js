var database = firebase.database();
// Restaurant Variable from
var restaurantName = "Blue Barracudas";

var chatBoard = $("#messageBoard");
var messageBox = $("#chatInput");
var messageButton = $("#sendMessage");
var signOutButton = $("#signOutButton");
var alertModal = $("#alertModal");
var pageRestaurantTitle = $("#restaurantName");
var createBox = $("#displayName");
var createButton = $("#userName");
var chatDiv = $(".createMsg");
var createDiv = $(".createName");
var userName = "";
var userID = "";
var users = [];

// Function List
//
// Renders Message onto chatboard
function RenderMessage(snap) {
  // Declare new element variables
  var chatBubble = $("<li>");
  var messageSpace = $("<row>");
  var newMessage = $(
    `<span><a class="user">${snap.userName}</a> : ${snap.message} </span>`
  );
  var timeAdded = $("<span>");
  var msgDateTime = moment(snap.dateAdded).format("DD/MM/YY h:mm a");

  // Message CSS
  messageSpace.addClass("messageSpace");

  newMessage.addClass("align-left");
  timeAdded.addClass("align-right chatTimeStamp");

  chatBubble.addClass("chatBubble");

  // Assign snap values for message
  timeAdded.text(msgDateTime);
  // timeAdded.text(new Date(snap.dateAdded));

  // Append both message and time added to the chatbubble
  chatBubble.append(newMessage);
  chatBubble.append(timeAdded);

  // Append the chat bubble to the board
  chatBoard.append(chatBubble);

  if (accountDetails.uid === snap.userID) {
    newMessage.css("color", "blue");
    $(".user").css("color", "black");
  } else {
    newMessage.css("color", "green");
    $(".user").css("color", "black");
  }
}

// Event listeners
//
// Create Button
createButton.on("click", function(event) {
  event.preventDefault();
  if (accountDetails.uid != null) {
    userName = createBox.val();
    userID = accountDetails.uid;
    database
      .ref("/" + restaurantName + "/users")
      .child(userID)
      .set({
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
        userName: userName
      });
    createBox.val("");
    createDiv.hide();
    chatDiv.show();
  } else {
    // Shows Alert modal informing user requirement of Google login to post
    alertModal.show();
  }
});

// Message Button
messageButton.on("click", function(event) {
  // Prevent default form submission behavior
  event.preventDefault();
  var dateAdded = moment().unix();
  console.log(dateAdded);
  database
    .ref("/" + restaurantName + "/thread")
    .child(dateAdded)
    .set(
      {
        // Push the message
        message: messageBox.val(),
        // & a timestamp for ordering later
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
        // User ID
        userName: userName,
        userID: accountDetails.uid
      },
      function(error) {
        if (error) {
          // The write failed...
        } else {
          // Data saved successfully!
          // Clear message box
          messageBox.val("");
        }
      }
    );
});
//   Database listeners
//
// When a child is added within the restaurant database reference
database
  .ref("/" + restaurantName + "/thread")
  .endAt()
  // Limit to the last item
  .limitToLast(1)
  // When child is added
  .on("child_added", function(snap) {
    // Render the child that was added
    RenderMessage(snap.val());
  });

// Make user sign out when they click on the sign out Button
signOutButton.on("click", function() {
  // Sign out from Firebase
  firebase.auth().signOut();
});

// Event listener for clicks on all buttons in Modal: clicks will close modal
$(".modal button").on("click", function() {
  // Hide modal
  alertModal.hide();
});

// Arguments begin here
//
// When page is loaded
$(document).ready(function() {
  // Set page name to restaurant Title
  pageRestaurantTitle.text(restaurantName);

  // Set parameters for database query
  var ref = database
    .ref("/" + restaurantName + "/thread")
    .orderByChild("dateAdded");

  // Take a snapshot and build the message board from the snap
  ref.once("value", function(snap) {
    // Clear current board
    chatBoard.empty();

    // With returned snapshot, iterate through each key passing to render message
    for (key in snap.val()) {
      // Use RenderMessage to print messages
      RenderMessage(snap.val()[key]);
    }
  });
});
