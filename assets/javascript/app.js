$(document).ready(function () {
    //1. Initialize Firebase
    var config = {
        apiKey: "AIzaSyASzCg2oXRu0TqTeL5mHPLXPMIY8yypRCw",
        authDomain: "gt201808-bbc02.firebaseapp.com",
        databaseURL: "https://gt201808-bbc02.firebaseio.com",
        projectId: "gt201808-bbc02",
        storageBucket: "gt201808-bbc02.appspot.com",
        messagingSenderId: "666822383926"
    };
    firebase.initializeApp(config);
    //variable to reference the database
    var database = firebase.database();

    //2. Add Train Button
    $("#addTrain").on("click", function (event) {
        event.preventDefault();
        //get user input
        var trainName = $("#inputName").val().trim();
        var trainDestination = $("#inputDestination").val().trim();
        var firstTrainTime = moment($("#inputFirstTrainTime").val().trim());
        var trainFrequency = $("#inputFrequency").val().trim();
        //Create local "temporary" object for holding train data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            time: firstTrainTime,
            frequency: trainFrequency
        };
        //Upload train data to database
        database.ref().push(newTrain);
        //Log keys to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.firstTrainTime);
        console.log(newTrain.frequency);

        alert("Train successfully added");
        //Clear every text-boxes
        $("#inputName").val("");
        $("#inputDestination").val("");
        $("#inputFirstTrainTime").val("");
        $("#inputFrequency").val("");
        return false;
    });
    //3. Create firebase event when user train data from the inputs
    database.ref().on("child_added", function (childSnapshot) {
        var firebaseData = childSnapshot.val();
        console.log(firebaseData);
        //Store keys into a variable
        var firebasetrainName = firebaseData.name;
        var firebasetrainDestination = firebaseData.destination;
        var firebasefirstTrainTime = firebaseData.time;
        var firebasetrainFrequency = firebaseData.frequency;
        //Log Train info in the console
        console.log(firebasetrainName);
        console.log(firebasetrainDestination);
        console.log(firebasefirstTrainTime);
        console.log(firebasetrainFrequency);
        //Calculation to determine the time of a train's next arrival
        var diffTime = moment().diff(moment.unix(firebasefirstTrainTime), "minutes");

        var tRemainder = diffTime % firebasetrainFrequency;

        var tMinutesTillTrain = firebasetrainFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        var nextTrainArrival = moment().add(tMinutesTillTrain, "m").format("HHmm");
        console.log("ARRIVAL TIME: " + nextTrainArrival);

        $("#trainTable > tbody").append("<tr><td>" + firebasetrainName + "</td><td>" + firebasetrainDestination + "</td><td>" + firebasetrainFrequency + " min" + "</td><td>" + nextTrainArrival + "</td><td>" + tMinutesTillTrain + "</td></tr>");
    });
});