
/* dependencies */

const path = require("path");                           // access paths
const express = require("express");                     // express
const app = express();									
const bodyParser = require('body-parser');              // parse request body
const http = require("http").Server(app);
var io  = require('socket.io')(http);


const MongoClient = require('mongodb').MongoClient;     // talk to mongo
var session = require('express-session');               // create sessions
const MongoStore = require('connect-mongo')(session);   // store sessions in Mongo so we don't get dropped on every server restart

var GameActions  = require('./game.js');
var userCount = 0;
var thisGame = null;



app.set("port", process.env.PORT || 3000)                       // we're gonna start a server on whatever the environment port is or on 3000
app.set("views", path.join(__dirname, "/public"));        		// tells us where our views are
app.set("view engine", "ejs");                                  // tells us what view engine to use

app.use(express.static('public'));                              // sets the correct directory for static files we're going to serve - this whole folder is sent to the user


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());                         			// for parsing application/json

app.use(function(req, res, next){                               // logs request URL
    
    var timeNow = new Date();
    console.log("-----> " + req.method.toUpperCase() + " " + req.url + " on " + timeNow); 

    next();
});


if(process.env.LIVE){                                                                           // this is how I do config, folks. put away your pitforks, we're all learning here.
    dbAddress = "mongodb://" + process.env.MLAB_USERNAME + ":" + process.env.MLAB_PASSWORD + "@ds243325.mlab.com:43325/empireofages";
} else {
    dbAddress = "mongodb://localhost:27017/wordsync";
}

console.log(dbAddress);

MongoClient.connect(dbAddress, function(err, db){
    if (err){
        console.log("MAYDAY! MAYDAY! Crashing.");
        return console.log(err);
    }

    var thisDb = db;

    var sessionSecret = process.env.SESSION_SECRET || "kj34i5h89adshasdflhj34qp89awfhilu";


    var sessionMiddleware = session({                                
            secret: sessionSecret ,             
            saveUninitialized: true,
            resave: false,
            secure: false,
            expires: null,
            cookie: {
                maxAge: null,
            }/*
            store: new MongoStore({ 
                db: thisDb,
                ttl: 60*60*12,                  // in seconds - so, 12 hours total. Ths should hopefully expire and remove sessions for users that haven't logged in
                autoRemove: 'native'
            })*/
    })

    io.use(function(socket, next) {						// connect session to socket.io
	    sessionMiddleware(socket.request, socket.request.res, next);
	});



    app.use(sessionMiddleware);

	/* ROUTES */

	io.on('connection', function(socket){



		console.log("socket.request.session.id");
    	console.log("---");
    	console.log(socket.request.session.id);					// access session

	    console.log('a user connected');
	    userCount++;
	    console.log("User count is now: " + userCount);

	    socket.on('disconnect', function(){
	        console.log('user disconnected');
	        userCount--;
	        console.log("User count is now: " + userCount);
	    });



	    socket.on('new game', function(){

	    	GameActions.createGame(db, socket.request.session.id, function sendNewGameBack(game){
	    		console.log("/*/* game /*/*");
	    		console.log(game);
	    		thisGame = game;
		        socket.emit('game created', game);
	    	});
	 
	    });


	    socket.on('join game', function(gameCode){

	    	GameActions.joinGame(db, socket.request.session.id, gameCode, function confirmJoin(status, game){
	    		if(status == "success"){
	    			console.log("/*/* game -/*/*");
	    			console.log(game);
	    			thisGame = game;
	    			io.emit("game joined");
		    	} else {
		    		io.emit("invalid game", "no such game")
		    	}
	    	});

	    });

	    /* GAME SOCKET COMMANDS */


	    socket.on('submit word', function(word){

	    	GameActions.submitWord(db, socket.request.session.id, thisGame.id, word, function confirmJoin(status, player, updatedGame){


	    		// we'll need to make sure NOT to send the history later, i guess

	    		if(status == "fail"){
	    			io.emit("error", player)		// really, player == message
	    		}


	    		if(status == "victory"){
	    			console.log("status: won!");
	    			io.emit("victory", updatedGame);
		    	} else if (status == "in progress") {
		    		console.log("status: in progress");
		    		io.emit("in progress", updatedGame)
		    	} else if (status = "waiting"){
		    		console.log("status: waiting");
		    		socket.emit("waiting", updatedGame)
		    	}
	    	});

	    });


	});
	    

	app.get("/game", function(req, res){

	    /*
			1. check session ID against DB
			2. if game exists and the status is "in progress, pass"
				2b. else, redirect back to game
			3. render game ID, player session id

	    */
 
	    GameActions.checkGame(db, req, thisGame.id, function confirmRealGame(status, game){


	    	if(status == "success"){
	    		res.render("game", {gameId: game.id, playerId: req.session.id})
	    	} else {
	    		res.redirect("/");
	    	}


	    })


	})

	app.get("/", function(req, res){
		console.log("session ID: ");
		console.log(req.session.id);
	    res.render("start");   
	})


	app.get("/victory", function(req, res){
	    res.render("victory");   
	})







	/* END ROUTES */


	/* 404 */

	app.use(function(req, res) {
	    res.status(404);
	    req.session.error = "404 - page not found!";
	    res.redirect("/");
	});


	/* LAUNCH*/

	http.listen(app.get("port"), function() {
	    console.log("Server started on port " + app.get("port"));
	});



});


