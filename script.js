// Initialize Firebase
    var config = {
    apiKey: "AIzaSyD_PL5O1dRwdz-Y6PZ_YijQFI13947Tdoc",
    authDomain: "train-schedular-9cf86.firebaseapp.com",
    databaseURL: "https://train-schedular-9cf86.firebaseio.com",
    projectId: "train-schedular-9cf86",
    storageBucket: "train-schedular-9cf86.appspot.com",
    messagingSenderId: "712746144135"
  };
  firebase.initializeApp(config);


var database = firebase.database();

//Declaring the current time
var currentTime = moment().format();

	console.log("Current Time: " + currentTime);
				
//When the button clicked run the snapshot 
$("#addTrainBtn").on("click", function() {
      event.preventDefault();
      // Grabs user input
	  var trainNameInput = $("#trainNameInput").val().trim();
	  var destinationInput = $("#destinationInput").val().trim();
	  var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").format("HH:mm");

	  var frequencyInput = $("#frequencyInput").val().trim();

	  // Creates local storage
	  var newTrain = {
		train: trainNameInput,
		destination: destinationInput,
		first: trainTimeInput,
		frequency: frequencyInput
    };
	//Setting the new values in the database
	database.ref().push(newTrain);

	console.log(newTrain.train);
  	console.log(newTrain.destination);
	console.log(newTrain.first);
	console.log(newTrain.frequency);
	
	//Clearing the inputs
	 $("#trainNameInput").val("");
  	 $("#destinationInput").val("");
	 $("#trainTimeInput").val("");
	 $("#frequencyInput").val("");
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());
	
  var trainName = childSnapshot.val().train;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().frequency;
  
  //the converted train time
  var trainTimeConverted = moment(trainTime, "HH:mm");
	
  //Declaring a time difference variable
  var timeDifference = moment().diff(moment(trainTimeConverted), "minutes");
	console.log(timeDifference);
	
  var frequencyMinutes = childSnapshot.val().frequency;
	console.log("Frequency Minutes: " + frequencyMinutes);
  
  var minutesAway = Math.abs(timeDifference % frequencyMinutes);
  	console.log("Minutes Away: " + minutesAway);
  
  var nextArrival = moment(currentTime).add(minutesAway, "minutes").format("hh:mm A");
	console.log("Next Arrival: " + nextArrival);
	
	
  //Adding into the table
  $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});