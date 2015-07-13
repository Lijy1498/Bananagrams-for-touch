//Declare Variables
var firstTouch = false;
var board = {tile: []};
var selectedTile = [];
var difference;

//Start initialisers
init();

//Draw the first frame
draw();

//On a touch...
function handleStart(evt) {
  evt.preventDefault();
  //for each touch
  for (var i = 0; i < evt.changedTouches.length; i++)  {
    //look at each tile  
    for (var g = 0; g < board.tile.length; g++) {
      //check it's location vs the touch
      if (evt.changedTouches[i].pageX >= board.tile[g].X) {
        if (evt.changedTouches[i].pageX <= board.tile[g].X+board.tile[g].Width) {
          if (evt.changedTouches[i].pageY >= board.tile[g].Y) {   
            if (evt.changedTouches[i].pageY <= board.tile[g].Y+board.tile[g].Height) {
	      //Get the position of the touch in comparison to the tile
              board.tile[g].distX = evt.changedTouches[i].pageX-board.tile[g].X;
              board.tile[g].distY = evt.changedTouches[i].pageY-board.tile[g].Y;
              //select the tile
	      selectedTile[i] = g;
              break;
            }
          }
        }
      }
    }
  }
}

//if a touch moves...
function handleMove(evt) {
  evt.preventDefault();
  
  //for each touch
  for (var i = 0; i < evt.changedTouches.length; i++)  {	
    //the selected tiles
    if (selectedTile >= 0) {
      //move selected tiles
      board.tile[selectedTile[i]].oldX = board.tile[selectedTile[i]].X
      board.tile[selectedTile[i]].oldY = board.tile[selectedTile[i]].Y
      board.tile[selectedTile[i]].X = evt.changedTouches[i].pageX - board.tile[selectedTile].distX;
      board.tile[selectedTile[i]].Y = evt.changedTouches[i].pageY - board.tile[selectedTile].distY;
      //redraw tiles
      draw();
    }
  }
}

//When user let's go
function handleEnd(evt) {
  evt.preventDefault();
  
  //for each touch
  for (var i = 0; i < evt.changedTouches.length; i++)  {  
    //no longer select the tile
    selectedTile[i] = -1;
  }
}

//declare events
var el = document.getElementById("canvas");
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchmove", handleMove, false);
  el.addEventListener("touchend", handleEnd, false);

//Redraw the frame  
function draw() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');   
  ctx.font = "48px serif";
  for (var f = 0; f < 10; f++)
  {
    //look at each tile  
    for (var g = 0; g < board.tile.length; g++) {
      if (g != f) {
        if (board.tile[f].X != board.tile[g].X) {
          if (board.tile[f].Y != board.tile[g].Y) {   
difference = board.tile[f].X%60;            
if (difference <= 30) {
board.tile[f].X = board.tile[f].X - difference;
} else {
board.tile[f].X = board.tile[f].X + difference;
            ctx.clearRect(board.tile[f].oldX,board.tile[f].oldY,board.tile[f].Width,board.tile[f].Height);
            ctx.fillStyle = "brown";
            ctx.fillRect(board.tile[f].X,board.tile[f].Y,board.tile[f].Width,board.tile[f].Height);
            ctx.fillStyle = "black";
            ctx.fillText(board.tile[f].letter,board.tile[f].X+5,board.tile[f].Y+40);
          }
        }
      }
    }
  }
}

//At the start of the program
function init() {
  //declare variables
  var alphabet = "AAAAAAAAAAAAABBBCCCDDDDDDEEEEEEEEEEEEEEEEEEFFFGGGGHHHIIIIIIIIIIIIJJKKLLLLLLLLLLMMMNNNNNNNNOOOOOOOOOOOPPPQQRRRRRRRRRSSSSSSTTTTTTTTTUUUUUUVVVWWWXXYYYZZ";
  var number = [];
  var hold;
  //Set variables for each tile
  for (var i = 0; i < 10; i++){
    number[i] = ((Math.random()*144));
    for (var g = 0; g <= i; g++)
    {
      hold = Math.round(number[i]);
      if (number[g] === hold)
      {
        number[i] = ((Math.random()*144));
        g = 0;
      }
    }
  number[i] = hold;
  board.tile[i] = {letter: alphabet.substring(number[i],number[i]+1), X:60*i, Y:60*i, Width:50, Height:50, distX:-1, distY: -1, oldX: 60*i, oldY:60*i};
  }
}