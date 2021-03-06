// Initialize Firebase
var config = {
    apiKey: "AIzaSyCYwfIA53ld0xgbhXBURYhj96a5Lo38cGw",
    authDomain: "rpsmultiplayer-73d3c.firebaseapp.com",
    databaseURL: "https://rpsmultiplayer-73d3c.firebaseio.com",
    projectId: "rpsmultiplayer-73d3c",
    storageBucket: "rpsmultiplayer-73d3c.appspot.com",
    messagingSenderId: "95505978167"
};
firebase.initializeApp(config);

var database = firebase.database();

window.onload = function () {

    // variables
    var wins1 = 0;
    var wins2 = 0;
    var losses1 = 0;
    var losses2 = 0;
    var user1;
    var user2;

    var user1Choice = "";
    var user2Choice = "";

    // verifying values
    var player1Exist = false;
    var player2Exist = false;
    var occupied = false;

    // click function
    $("#start").on("click", function () {

        // Check if player positions are occupied or not
        console.log(occupied);
        if (!occupied) { // snapshot.child("player").numChildren < 2

            database.ref('/players').once("value", function (snapshot) {
                // check if returns null  
                console.log(snapshot.val());

                if (snapshot.val() === null) {
                    console.log("Player 1!");
                    // when clicks, grabs user name
                    user1 = $("#usrName").val().trim();

                    // upload all the data into firebase
                    database.ref('/players/1').set({ // WHY DOES IT HAS TO BE HERE???
                        name: user1,
                        wins: wins1,
                        losses: losses1
                    })
                    // hide entry, no longer can input names
                    $("#entry").hide();
                    // Update verifying variable
                    player1Exist = true;

                    // text user 1 and intructions
                    $("#text").text("Hi, " + user1 + "! You are Player 1!");
                    // $("#text").append("<br><br>It's your turn!");
                }
                // else goes into player 2 box
                else {
                    console.log("Player 2!");
                    // when clicks, grabs user name
                    user2 = $("#usrName").val().trim();

                    // hide entry, no longer can input names
                    $("#entry").hide();
                    // upload all the data into firebase
                    database.ref('/players/2').set({
                        name: user2,
                        wins: wins2,
                        losses: losses2
                    })
                    // Update verifying variable
                    player2Exist = true;

                    // text user 2 and intructions
                    $("#text").text("Hi, " + user2 + "! You are Player 2!");
                    console.log("what is user 1?" + user1);
                    // $("#text").append(user1 + )
                    // $("#text").append("<br><br>It's your turn!");

                    // still some problems with it!
                    // maybe need to change in firebase???
                    occupied = true;
                }
            });
        }
        else {
            console.log("It's occupied!");
        }
    })
    console.log(user1);
    console.log(user2);

    var btnExists = false;

    database.ref('/players').on("value", function (snapshot) {
        console.log(snapshot.child('2').exists());
        if (snapshot.child('2').exists() && !btnExists) {
            var options = $("<div class='options1'>");
            options.append("<button id='plyr1Choice' value='rock'>Rock</button>");
            options.append("<button id='plyr1Choice' value='paper'>Paper</button>");
            options.append("<button id='plyr1Choice' value='scissors'>Scissors</button>");
            // append the new div into playerbox
            $("#Player1").append(options);

            // append rock, paper, or scissors options in the panel
            var options = $("<div class='options2'>");
            options.append("<button id='plyr2Choice' value='rock'>Rock</button>");
            options.append("<button id='plyr2Choice' value='paper'>Paper</button>");
            options.append("<button id='plyr2Choice' value='scissors'>Scissors</button>");
            // append the new div into playerbox
            $("#Player2").append(options);

            btnExists = true;
        }
    })

    // PROBLEM IS HERE!!!!! NOT STORED D:
    console.log(user1);
    console.log(user2);

    $("#Player1").on("click", "#plyr1Choice", function () {
        console.log($(this).val());
        console.log("who is user 2? " + user2);

        database.ref("/players/2").once("value", function(snapshot) {
            $("#text").html(snapshot.val().name + ", It's your turn!");
        })


        database.ref('/players/1').update({
            choice: $(this).val()
        });

        // $(".options1").html("<h4>" + $(this).val() + "</h4>");
    })

    $("#Player2").on("click", "#plyr2Choice", function () {
        console.log($(this).val());
        console.log("who is user 1? " + user2);

        database.ref("/players/1").once("value", function(snapshot) {
            $("#text").html(snapshot.val().name + ", It's your turn!");
        })

        database.ref('/players/2').update({
            choice: $(this).val()
        });

        // $(".options2").html("<h4>" + $(this).val() + "</h4>");
    })

    // append result of the game
    // HOW DO I GET IT TO EVALUATE ONCE PLAYER 
    database.ref('/players').once("value", function (snapshot) {
        var temp = snapshot.val();
        console.log(typeof temp);
        console.log(snapshot.child('1').val().choice);
        // console.log(snapshot.child('2').on("value").choice);

        var usr1Choice = snapshot.child('1').val().choice;
        var usr2Choice = snapshot.child('2').val().choice;

        // rock vs everything else
        if (usr1Choice === "rock" && usr2Choice === "paper") {
            $("#middleBox").text("Player 2 win!");

            btnExists = false;

            wins2++;
            losses1++;

            database.ref('/players/2').update({
                wins: wins2
            })
            database.ref('/players/1').update({
                losses: losses1
            })
        }
        else if (usr1Choice === "rock" && usr2Choice === "scissors") {
            $("#middleBox").text("Player 1 win!");

            btnExists = false;

            wins1++;
            losses2++;

            database.ref('/players/1').update({
                wins: wins1
            })
            database.ref('/players/2').update({
                losses: losses2
            })
        }
        else if (usr1Choice === "rock" && usr2Choice === "rock") {
            $("#middleBox").text("Tie!");

            btnExists = false;
        }
        // paper vs. everything else
        else if (usr1Choice === "paper" && usr2Choice === "rock") {
            $("#middleBox").text("Player 1 win!");

            btnExists = false;

            wins1++;
            losses2++;

            database.ref('/players/1').update({
                wins: wins1
            })
            database.ref('/players/2').update({
                losses: losses2
            })
        }
        else if (usr1Choice === "paper" && usr2Choice === "scissors") {
            $("#middleBox").text("Player 2 win!");

            btnExists = false;

            wins2++;
            losses1++;

            database.ref('/players/2').update({
                wins: wins2
            })
            database.ref('/players/1').update({
                losses: losses1
            })
        }
        else if (usr1Choice === "paper" && usr2Choice === "paper") {
            $("#middleBox").text("Tie!");

            btnExists = false;
        }

        // scissors vs. everything else
        else if (usr1Choice === "scissors" && usr2Choice === "paper") {
            $("#middleBox").text("Player 1 win!");

            btnExists = false;

            wins1++;
            losses2++;

            database.ref('/players/1').update({
                wins: wins1
            })
            database.ref('/players/2').update({
                losses: losses2
            })
        }
        else if (usr1Choice === "scissors" && usr2Choice === "rock") {
            $("#middleBox").text("Player 2 win!");

            btnExists = false;

            wins2++;
            losses1++;

            database.ref('/players/2').update({
                wins: wins2
            })
            database.ref('/players/1').update({
                losses: losses1
            })
        }
        else if (usr1Choice === "scissors" && usr2Choice === "scissors") {
            $("#middleBox").text("Tie!");

            btnExists = false;
        }
    })

    // --------------------Update html using database info -------------------

    // simultaneously updates both users' browsers
    // Player 1 info
    database.ref('/players/1').on("value", function (snapshot) {

        // // text user 1 and intructions
        // $("#text").text("Hi, " + snapshot.val().name + "! You are Player 1!");
        // $("#text").append("<br><br>It's your turn!");

        // text user name onto html
        $("#Player1").html("<h3>" + snapshot.val().name + "</h3>");

        // Updates user choice
        $(".options1").html(snapshot.val().choice);
    })
    // Player 2 info
    database.ref('/players/2').on("value", function (snapshot) {

        // // text user 2 and intructions
        // $("#text").text("Hi, " + snapshot.val().name + "! You are Player 2!");
        // $("#text").append("<br><br>It's your turn!");

        // text user name onto html
        $("#Player2").html("<h3>" + snapshot.val().name + "</h3>");

        // Updates user choice
        $(".options2").html(snapshot.val().choice);
    })
    
    database.ref('/players/1').onDisconnect().remove(); // HOW DO I WRITE THIS???? WHERE DO I PUT THIS??
    database.ref('/players/2').onDisconnect().remove();
}

