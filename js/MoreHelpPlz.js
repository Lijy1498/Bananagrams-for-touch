var firstTouch = false;
var board = {tile: []};
var selectedTile = [];

init();
draw();


function handleStart(evt) {
  evt.preventDefault();
  for (var i = 0; i < evt.changedTouches.length; i++)  {  
    for (var g = 0; g < board.tile.length; g++) {
      if (evt.changedTouches[i].pageX >= board.tile[g].X) {
        if (evt.changedTouches[i].pageX <= board.tile[g].X+board.tile[g].Width) {
          if (evt.changedTouches[i].pageY >= board.tile[g].Y) {   
            if (evt.changedTouches[i].pageY <= board.tile[g].Y+board.tile[g].Height) {
              board.tile[g].distX = evt.changedTouches[i].pageX-board.tile[g].X;
              board.tile[g].distY = evt.changedTouches[i].pageY-board.tile[g].Y;
              selectedTile[i] = g;
              break;
            }
          }
        }
      }
    }
  }
}

function handleMove(evt) {
  evt.preventDefault();
  
  for (var i = 0; i < evt.changedTouches.length; i++)  {	
    if (selectedTile >= 0) {
      board.tile[selectedTile[i]].X = evt.changedTouches[i].pageX - board.tile[selectedTile].distX;
      board.tile[selectedTile[i]].Y = evt.changedTouches[i].pageY - board.tile[selectedTile].distY;
      draw();
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  
  for (var i = 0; i < evt.changedTouches.length; i++)  {  
    selectedTile[i] = -1;
  }
}

var el = document.getElementById("canvas");
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchmove", handleMove, false);
  el.addEventListener("touchend", handleEnd, false);
  
function draw() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');   
  ctx.clearRect(0,0,600,600);
  ctx.font = "48px serif";
  for (var f = 0; f < 10; f++)
  {
    ctx.fillStyle = "brown";
    ctx.fillRect(board.tile[f].X,board.tile[f].Y,board.tile[f].Width,board.tile[f].Height);
    ctx.fillStyle = "black";
    ctx.fillText(board.tile[f].letter,board.tile[f].X+5,board.tile[f].Y+40);
  }
}

function init() {
  var alphabet = "AAAAAAAAAAAAABBBCCCDDDDDDEEEEEEEEEEEEEEEEEEFFFGGGGHHHIIIIIIIIIIIIJJKKLLLLLLLLLLMMMNNNNNNNNOOOOOOOOOOOPPPQQRRRRRRRRRSSSSSSTTTTTTTTTUUUUUUVVVWWWXXYYYZZ";
  var number = [];
  var hold;
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
  board.tile[i] = {letter: alphabet.substring(number[i],number[i]+1), X:60*i, Y:50, Width:50, Height:50, distX:-1, distY: -1};
  }
}