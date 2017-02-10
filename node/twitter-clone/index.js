var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");

var app = express();


// this tells the app where our views are and which view engine to use
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// this creates a global array called "entries" and makes it available in all the different views
// The app.locals object has properties that are local variables within the application.
// Once set, the value of app.locals properties persist throughout the life of the application, in contrast with res.locals properties that are valid only for the lifetime of the request.

var entries = [];
app.locals.entries = entries;

// app.use() tells express which middleware we're using
// app.use([path,] callback [, callback...])	
// Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.
app.use(logger("dev")); // this uses a middleware called Morgan to log any requests

app.use(bodyParser.urlencoded({ extended: false}));


// ROUTES //

app.get("/", function(request, response){
	console.log("going to  '/' ");
	response.render("index");		// this renders views/index.ejs when the user GETs "/"
})


app.get("/new-entry", function(request, response){
	response.render("new-entry");
})

app.post("/new-entry", function(request, response){
	if (!request.body.title || !request.body.body) {
		response.status(400).send("Entries must have a title and a body");
		return;
	}
	entries.push({
		title: request.body.title,
		content: request.body.body,
		published: new Date()
	});
	response.redirect("/");
})

app.use(function(request, response){
	//I get that this renders a 404 page, but I don't get *why*
	response.status(404).render("404");
})

// this starts the server on port 3000
http.createServer(app).listen(3000, function(){
	console.log("We've started the app on port 3000!");
})