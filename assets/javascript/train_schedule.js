var config = {
    apiKey: "AIzaSyA-sCTlcxouQiL1yKMbUzlZGZ12CmFhguQ",
    authDomain: "train-schedule-ed1d1.firebaseapp.com",
    databaseURL: "https://train-schedule-ed1d1.firebaseio.com",
    projectId: "train-schedule-ed1d1",
    storageBucket: "train-schedule-ed1d1.appspot.com",
    messagingSenderId: "443673480637"
  };

firebase.initializeApp(config);

var database = firebase.database();

// function for submit button
$("#addTrainBtn").on("click", function(){
  // declare variables that get the value from the form
  var newName = $("#trainName").val().trim();
  var newDestination = $("#destination").val().trim();
  var newFirstTime = $("#firstTime").val().trim();
  var newFrequency = $("#frequency").val().trim();

  // create a new object and push it to the database
  var newTrain = {
    name: newName,
    dest: newDestination,
    first: newFirstTime,
    freq: newFrequency,
  }

  database.ref().push(newTrain);

  // clears form fields
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTime").val("");
  $("#frequency").val("");

  return false;
});


database.ref().on("child_added", function(childSnapshot, prevChildKey){
  
  // declaring variables for new values
  
  var newName = childSnapshot.val().name;
  var newDestination = childSnapshot.val().dest;
  var newFirstTime = childSnapshot.val().first;
  var newFrequency = childSnapshot.val().freq;

  var currentTime = moment();

  var firstTimeConverted = moment(newFirstTime, "hh:mm").subtract(1, "days");
  
  // get the difference between now and the time of the first train
  // by subtracting the current time from the first train time
  timeDiff = moment().diff(moment(firstTimeConverted), "minutes");

  // time apart
  var remainder = timeDiff % newFrequency;

  // minutes until the next train calculated by subtracting the remainder from the frequency
  var minsUntilTrain = newFrequency - remainder;

  // calculate next train time by adding the current time to the minsUntilTrain
  var nextTrainTime = moment().add(minsUntilTrain, "minutes");

  // appending to html table
  $("#trainTable > tbody").append("<tr><td>" + newName + "</td><td>" + newDestination + "</td><td>" + newFrequency + "</td><td>" + moment(nextTrainTime).format("hh:mm") + "</td><td>" + minsUntilTrain);

  return false;
});
