var run = true;
var NUM_FLOORS = 6;
var currentFloor = 1;
var destination = 1;
var moving = false;


$(document).ready(main);


function main(){

    console.log("hi!");

    initialize();
        

    setInterval(function(){
        mainLoop();
    }, 1000);

    $(".floor").click(function(){
        if(!moving){
            var id = $(this).attr("id");
            destination = id;
            console.log("destination is now: " +  destination);  
        }
        
    });

    $(".floor-button").click(function(){
        if(!moving){
            var id = $(this).attr("id");
            destination = id;
            $(this).addClass("selected");
        }
        
    });

}

function mainLoop(){

    if(destination != currentFloor){
        moving = true;
        if(destination > currentFloor){
        up();
        } else if(destination < currentFloor){
            down();
        }
    } else {
        moving = false;
        $(".floor-button").removeClass("selected");
    }
}



function initialize(){

// This creates the floors

    for(var i = 1; i <= NUM_FLOORS; i++){
        $(".elevator").prepend("<div class = 'floor' id = '" + i + "'></div");
        $(".people").prepend("<div class = 'waiting-area' id = '" + i + "'></div");
        $(".controls").append("<br><button class = 'floor-button' id = '" + (NUM_FLOORS + 1 - i) + "'>" + (NUM_FLOORS + 1 - i) + "</button>");

        if(i == 1){
            $("#1").addClass("active");
        }
    }

    var height = $(window).height()/NUM_FLOORS - 10;
    $(".floor").height(height + "px").width(height + "px");
    $(".waiting-area").height(height + "px").width(height + "px");
    
}

function up(){
    $("#" + currentFloor).removeClass("active");
    currentFloor += 1;
    $("#" + currentFloor).addClass("active");
}


function down(){
    $("#" + currentFloor).removeClass("active");
    currentFloor -= 1;
    $("#" + currentFloor).addClass("active");
}

$("#move-up").click(function(){
    if(destination<NUM_FLOORS){
        destination += 1;
        console.log("destination is now: " +  destination);  
    }
});

$("#move-down").click(function(){
    if(destination>1){
        destination -= 1;
        console.log("destination is now: " +  destination);  
    }
});




