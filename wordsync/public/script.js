var socket = io();



$("body").on("click", "#new-game", function(){
	console.log("new game");
	socket.emit('new game', null);
});


$("body").on("click", "#join-game", function(){
	var gameCode = $("#room-code").val().trim().toLowerCase();
	socket.emit('join game', gameCode);
});


socket.on("game created", function(game){
	console.log(game);
	$("#new-game").parent().prepend("<span>Waiting for the other player to join game " + game.id + "</span>");
	$("#new-game").remove();
})

socket.on("game joined", function(game){
	console.log("joined game!");
	window.location.href = "/game";
})


socket.on("invalid game", function(error){
	console.log(error);
	$("#game-error").text(error)
})



socket.on("victory", function(){
	window.location.href = "/victory";
})


socket.on("waiting", function(updatedGame){
	console.log("waiting...");
	$("#waiting-status").show();
	$("#next-word").val("").hide();
	$("#submit-word").hide();
	updateScreen(updatedGame.player1.current_word, updatedGame.player2.current_word);
})

socket.on("in progress", function(updatedGame){
	console.log("in progress...");
	updateScreen(updatedGame.player1.history[updatedGame.player1.history.length - 1], updatedGame.player2.history[updatedGame.player2.history.length - 1]);
})






$("body").on("click", "#submit-word", function(){
	var word = $("#next-word").val().trim().toLowerCase();
	socket.emit("submit word", word);
})



function updateScreen(p1word, p2word){

	$("#waiting-status").hide();
	$("#next-word").val("").show();
	$("#submit-word").show();

	if(p1word == null || p1word == "null") { p1word = "waiting..." }
	if(p2word == null || p2word == "null") { p2word = "waiting..." }

	$("#p1-word").text(p1word);
	$("#p2-word").text(p2word);

}