var database = firebase.database();
// Restaurant Variable from
var restaurantID = restoInfo.id;

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

function checkForRecord(restoID, restoName) {
  // If a record isn't found, create it
  console.log("checking...");
  database
    .ref()
    .once("value")
    .then(function(snap) {
      console.log(snap.child("Blue Barracudas").val());

      // If determined to not have the restaurant place ID. Create the structure with the name as the first nest
      if (snap.child(restoID).val() == null) {
        // Create new restaurant record with name nested within
        database.ref("/" + restoID).set({
          name: restoName
        });
      }
    });
}

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
  // Prevent default behavior
  event.preventDefault();
  // If account id is found to be null (user is not logged in)
  if (accountDetails.uid != null) {
    userName = createBox.val();
    userID = accountDetails.uid;
    database
      .ref("/" + restaurantID + "/users")
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
    .ref("/" + restaurantID + "/users/" + accountDetails.uid)
    .once("value", function(snap) {
      userName = snap.val().userName;
      console.log(userName);
      database
        .ref("/" + restaurantID + "/thread")
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
});
//   Database listeners
//
// When a child is added within the restaurant database reference
database
  .ref("/" + restaurantID + "/thread")
  .endAt()
  // Limit to the last item
  .limitToLast(1)
  // When child is added
  .on("child_added", function(snap) {
    // Render the child that was added
    RenderMessage(snap.val());

    // TODO: Create way to keep the modal body scrolled to the bottom
  });

// Chat Button event listener to display Modal for chatboard
$(".chat-button").on("click", function() {
  // Show the modal
  $("#chatModal").modal("show");
  console.log("click");
  console.log("name: " + restoInfo.name);
  console.log("resto id: " + restoInfo.id);

  // Assign restaurant name to title of window
  $("#restaurantName").text(restoInfo.name);

  // Check for record and create if not available
  checkForRecord(restoInfo.id, restoInfo.name);

  // Check if user already has a userName
  var ref2 = database.ref("/" + restaurantID + "/users/" + accountDetails.uid);
  ref2.once("value", function(snap) {
    var displayName = accountDetails.displayName;
    console.log(snap.val());
    if (snap.exists()) {
      $("#displayName").val(snap.val().userName);
      $(".createName").hide();
      $(".createMsg").show();
    } else {
      $("#displayName").val(displayName);
    }
  });
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
  // Set parameters for database query
  var ref = database
    .ref("/" + restaurantID + "/thread")
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
