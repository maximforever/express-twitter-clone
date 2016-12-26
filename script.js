var run = true;
var NUM_FLOORS = 10;
var currentFloor = 1;
var destination = 1;
var moveList = [];
var moving = false;


$(document).ready(main);


function main(){

    console.log("hi!");

    initialize();
        

    setInterval(function(){
        mainLoop();
    }, 1000);


    $(".floor-button").click(function(){

        var id = $(this).attr("id");

        if(moveList.indexOf(id) == -1){
            moveList.push(id);
            $(this).addClass("selected");
            $("#array").text(moveList);
        }
    });

}

function mainLoop(){

    if(moveList.length > 0){

            console.log("Floors: " + moveList);
            moving = true;
            destination = moveList[0];


            if(destination > currentFloor){
                up();
            } else if(destination < currentFloor){
                down();
            } else {
                moveList.splice(0,1);       // remove the floor we just arrived to from the list
                $("#array").text(moveList);
                $("#" + currentFloor).removeClass("selected"); 
            } 
        
    } else {
        console.log("No next floor selected");
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

    $(".controls").append("<br><p> Next floors: <span  id = 'array'>" + moveList + "</span></p>");

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





