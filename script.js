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

// Create a variable to reference the database
var database = firebase.database();

//Declaring the current time
var currentTime = moment().format();

//Logging the current time
	console.log("Current Time: " + currentTime);
				
//When the submit button is clicked, we will run the snapshot function below.
$("#addTrainBtn").on("click", function() {
      // Prevent the page from refreshing
      event.preventDefault();

      // Grabs user input
	  var trainNameInput = $("#trainNameInput").val().trim();
	  var destinationInput = $("#destinationInput").val().trim();
	  var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").format("HH:mm");
	//Saving this goodness
//	  var frequencyForm = moment($("#frequencyForm").val().trim().format("mm"));
	  var frequencyInput = $("#frequencyInput").val().trim();

	  // Creates local "temporary" object for holding inputs
	  var newTrain = {
		train: trainNameInput,
		destination: destinationInput,
		first: trainTimeInput,
		frequency: frequencyInput
    };
	//Setting the new values in the database
	database.ref().push(newTrain);
	
	//Console.logging to make sure the new data has been stored to the database
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

//Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());
	
  // Store everything into a variable.
  var trainName = childSnapshot.val().train;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().frequency;
  
  //Variable to figure out the converted train time
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