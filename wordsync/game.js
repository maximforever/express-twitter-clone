const database = require("./database");

function createGame(db, playerId, confirmGame){

	var game = {
		id: generateId(4),
		status: "waiting",
		player1: {
			id: playerId,
			current_word: null,
			history: []
		},
		player2: {
			id: null,
			current_word: null,
			history: []
		}
	}


	database.create(db, "games", game, function(newGame){
			console.log("new game created:");
			console.log(newGame.ops[0]);
			confirmGame(newGame.ops[0]);
    });
}


function joinGame(db, playerId, gameId, confirmJoin){


	var gameQuery = {
		id: gameId
	}

	database.read(db, "games", gameQuery, function(game){

		console.log(game);

		if(game.length == 1 && (game[0].player2.id == null || game[0].player2.id == "null")){

			console.log("this is a real game");

			var updatedGame = {
				$set: {
					status: "in progress",
					player2: {
						id: playerId,
						current_word: null,
						history: []
					},
					start: Date.now()
				}
			}

			database.update(db, "games", gameQuery, updatedGame, function(updatedGame){
				confirmJoin("success", updatedGame);
			})

		} else {
			console.log("no such game");
			confirmJoin("failure", null);
		}
	})
}


function checkGame(db, req, gameId, gameResult){

	var gameQuery = {
		id: gameId
	}

	database.read(db, "games", gameQuery, function(games){
		console.log(games[0]);
		if(games.length != 1 || games[0].id != gameId || games[0].status != "in progress"){
			console.log("no such game found");
			gameResult("fail", null);
			return;
		}

		if(games[0].player1.id != req.session.id && games[0].player2.id != req.session.id ){
			console.log("this player isn't in the game");
			gameResult("fail", null);
			return;
		}

		if(games[0].player1.id == req.session.id){
			console.log("this is player 1");
		} else if(games[0].player2.id == req.session.id){
			console.log("this is player 2");
		} 

		gameResult("success", games[0]);

	});
}


function submitWord(db, playerId, gameId, word, wordResult){

	var gameQuery = {
		id: gameId
	}

	word = word.trim().toLowerCase();

	database.read(db, "games", gameQuery, function(games){

		if(games.length != 1 || games[0].id != gameId){
			console.log("no such game found");
			wordResult("fail", null);
			return;
		}

		if(games[0].player1.id != playerId && games[0].player2.id != playerId ){
			console.log("this player isn't in the game");
			wordResult("fail", null);
			return;
		}

		var game = games[0];

		var player = null,
			otherPlayer = null

		if(game.player1.id == playerId) { 
			player = "player1"; 
			otherPlayer = "player2";
		} 

		if(game.player2.id == playerId) { 
			player = "player2"; 
			otherPlayer = "player1"; 
		}

		console.log("player: " + player);
		console.log("otherPlayer: " + otherPlayer);

		console.log("incoming word: " + word);
		console.log("other word: " + game[otherPlayer].current_word);



		if(game[otherPlayer].current_word == null || game[otherPlayer].current_word == "null"){					// if the other player hasn't submitted a word...

			var gameUpdate = {
				$set: {
					status: "waiting"
				}
			}

			gameUpdate.$set[player + ".current_word"] = word;

			console.log("gameUpdate");
			console.log(gameUpdate);

			database.update(db, "games", gameQuery, gameUpdate, function(updatedGame){
				wordResult("waiting", player, updatedGame);
			})


		} else {			// if both players have submitted a word...

			var gameUpdate = {
				$set: {
					status: "in progress"
				},
				$push: {}
			}

			if(game[player].current_word == null || game[player].current_word == "null") { game[player].current_word = word }



			gameUpdate.$push[player + ".history"] = game[player].current_word;
			gameUpdate.$push[otherPlayer + ".history"] = game[otherPlayer].current_word;

			gameUpdate.$set["player1.current_word"] = null;
			gameUpdate.$set["player2.current_word"] = null;



			if(game[otherPlayer].current_word == word){			// if they are identical, WE WIN!

				console.log("WE WIN!");
				gameUpdate.$set.status = "won";

				database.update(db, "games", gameQuery, gameUpdate, function(updatedGame){
					wordResult("victory", player, updatedGame);
				})

				
			} else {											// if not, we go another round!

				console.log("not quite there yet...");

				database.update(db, "games", gameQuery, gameUpdate, function(updatedGame){
					wordResult("in progress", player, updatedGame);
				})

			}


		}




	});

}











function generateId(length){
	var chars = "abcdefghijklmnopqrstuvwxyz1234567890"
    var id = "";

    for (var i = 0; i < length ; i++){
    	id += chars[Math.floor(Math.random()*chars.length)]
    }

    return id;

}


module.exports.createGame = createGame;
module.exports.joinGame = joinGame;
module.exports.checkGame = checkGame;
module.exports.submitWord = submitWord;