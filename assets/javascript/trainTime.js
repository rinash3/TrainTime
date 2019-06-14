// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCOy8dpg91UlNVXF4LhaQN7eLqj2FdLYpo",
    authDomain: "traintime-5d9fd.firebaseapp.com",
    databaseURL: "https://traintime-5d9fd.firebaseio.com",
    projectId: "traintime-5d9fd",
    storageBucket: "",
    messagingSenderId: "1022334996187",
    appId: "1:1022334996187:web:190ee146a2fce94c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// 2. Button for adding Train
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs train input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#dest-input").val().trim();
    var trainFirst = moment($("#first-train-input").val().trim(), "hh:mm").format("X");
    var trainFreq = $("#freq-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        first: trainFirst,
        frequency: trainFreq
    };
    //Update train info into the DB
    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.frequency);

    alert("Train schedule successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#dest-input").val("");
    $("#first-train-input").val("");
    $("#freq-input").val("");

})

database.ref().on("child_added", function(childSnapshot) {

    // console.log(childSnapshot.val()); // logging the child data from the database - returns all info of added trains

    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().first;
    var trainFreq = childSnapshot.val().frequency;

    console.log(trainName);
    console.log(trainDest);
    console.log(trainFirst);
    console.log(trainFreq);

    //first available train time
    var firstTrain = moment(trainFreq, "HH:mm").subtract(1, "years");
    console.log(firstTrain);

    // current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between current time and first/next train time
    var diffTime = moment().diff(moment(firstTrain), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder) - calculating time passed from the first/next train
    var timeLeft = diffTime % trainFreq;
    console.log(timeLeft);

    //calculating the min for the next train to arrive (*train arrives every 5 min , 2 min passed so next train is 3 min away)
    var minutsAway = trainFreq - timeLeft;
    console.log("MINUTES TILL TRAIN: " + minutsAway);
    //calculating the arrival time of the next train (adding the current time to min away)
    var nextArrival = moment().add(minutsAway, "minutes").format("hh:mm");
    console.log("ARRIVAL TIME: " + nextArrival);

    // Create the new row in the table
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextArrival),
        $("<td>").text(minutsAway)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});