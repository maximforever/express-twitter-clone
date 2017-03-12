var floors = 10;
var elQueue = [];
var floorQueue = [];
el = new Elevator();			// create elevator

$(document).ready(main);


function main(){
	console.log("hey there!");
	

	initialize();

	setInterval(function(){
		mainLoop();
	}, 1000)

	/* listeners*/

	$(".floor").click(function(){
		 
		
	});



	$(".call-button").click(function(){
		var dir;
		var fl = Number($(this).attr("data-floor"));	// attr("data-floor") is a string, I think - so we need to coerce it into a number.

		$(this).addClass("selected");					// denote that this call has been made

		if($(this).hasClass("up")){
			dir = "UP";
		} else if($(this).hasClass("down")){
			dir = "DOWN";
		} else {
			dir = "ERROR";
		}

		console.log("You clicked the " + dir + " button on floor " + fl);
		var call = [fl, dir]
		elQueue.push(call);

	});

	$(".floor-button").click(function(){
		

		var nextFloor = $(this).attr("id");
		if(floorQueue.indexOf(nextFloor) == -1 && el.floor !== nextFloor){
				floorQueue.push(Number($(this).attr("id")));				// attr("id") is a string, I think - so we need to coerce it into a number.
				$(this).addClass("selected");
				v
		}
	});


	$(".clear").click(function(){
		elQueue = [];
		floorQueue = [];
		$(".floor").removeClass("next-floor");
	});

}

function initialize(){								// sets up initial map
	 for(var i = 0; i < floors; i++){				// draw map
	 	$(".layout").append("<div class = 'floor-container'><div class = 'floor' id = 'floor-" + (floors - i) + "' data-floor = " + (floors - i) + ">" + /*(floors - i) + */"</div><div class = 'floor-panel'><div class = 'call-button up' data-floor = " + (floors - i) + "> </div><div class = 'call-button down' data-floor = " + (floors - i) + "> </div></div></div>");

	 	// draw buttons:

	 	
	 	$(".buttons").append("<div class = 'floor-button' id = " + (floors - i) + ">" + (floors - i) + "</div>");




	 	if(el.floor == (floors - i)){
	 		$("#floor-" + (floors-i)).addClass("at-floor"); 
	 	}
	 }

}


function mainLoop(){
	console.log("-------");
	console.log("floor queue is [" + floorQueue + "]");
	console.log("el queue is [" + elQueue + "]");

	/* Move this code into its own function */

	var elevatorQueueFloors = [];

 	for(var i = 0; i < elQueue.length; i++){					// this gets us a lit of only the floors in the elQueue 2D array
 		elevatorQueueFloors.push(elQueue[i][0]);
 	}

 	console.log("elevatorQueueFloors is " + elevatorQueueFloors);

 	var floorPos = elevatorQueueFloors.indexOf(el.floor);							// in our new array of JUST floors from our elQueue 2D array, this gives the position of the floor we're currently on (or -1 if our floor isn't in the queue)

	// if we're on the floor in the queue, we need to do a few things:


	if(floorQueue.indexOf(el.floor) != -1){										// if the current floor is in the floorQueue, we can stop and let people on/off, then remove the floor from the queue
		floorQueue.splice(floorQueue.indexOf(el.floor), 1);						// remove that floor from queue
		console.log("we're on the right floor for a call from INSIDE the elevator!");
		console.log("removed floor " + el.floor + " from floorQueue");
	}

	if(floorPos != -1 && elQueue[floorPos][1] == el.dir){						// if someone made a call from this floor in the direction we're heading in, let's pick them up and remove this floor from the queue
		console.log("floorPos is " + floorPos);
		elQueue.splice(floorPos, 1);											// remove that floor from queue - floorPos for the position of the element in the array, and 1 for how many elements to slice
		console.log("we're on the right floor for a call from OUTSIDE the elevator!");
		console.log("removed floor " + el.floor + " from elQueue");
		$(".call-button[data-floor='" + el.floor +"'").removeClass("selected");
	}


	if (floorQueue.length > 0){
		if(floorQueue[0] > el.floor){
			el.move(el.floor + 1);
			el.dir = "UP";
		} else if(floorQueue[0] < el.floor) {
			el.move(el.floor - 1);
			el.dir = "DOWN";
		} 

	} else if(elQueue.length > 0){

		if(elQueue[0][0] > el.floor){
			el.move(el.floor + 1);
			el.dir = "UP";
		} else if(elQueue[0][0] < el.floor) {
			el.move(el.floor - 1);
			el.dir = "DOWN";
		} 

	} else {
		console.log("all calls completed!");
	}

	refresh();

}



function refresh(){		// this should only handle the visual updates

	console.log("REFRESHING!");

	$(".floor").removeClass("at-floor next-floor");
	$(".floor-button").removeClass("selected");
	

	// get all the floors called from the platforms from elQueue[]

	var elevatorQueueFloors = [];

 	for(var i = 0; i < elQueue.length; i++){
 		elevatorQueueFloors.push(elQueue[i][0]);
 	}


	for(var i = 0; i < floors; i++){
 		if(floorQueue.indexOf(i+1) != -1){
 			console.log("Floor still in queue: " + floorQueue[(i+1)]);
	 		$("#floor-" + (i+1)).addClass("next-floor"); 
	 		$("#" + (i+1)).addClass("selected"); 
	 	}
	}

	// the LAST thing we want to do is denote where our elevator is
	$("#floor-" + el.floor).addClass("at-floor"); 
}


function getAllOutsideFloors(){					// gets 



}


function Elevator(){
	this.floor = 1;
	this.dir = "up";
	this.move = function(fl){
		this.floor = fl;
		console.log("moving to floor " + fl);
	}
}