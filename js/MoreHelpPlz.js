//Declare Variables
var board = { tile: [], selectedTile: [] };
var difference;

//Start initialisers
init();

//Draw the first frame
draw();

//On a touch...
function handleStart(evt) {
    evt.preventDefault();
    //for each touch
    for (var i = 0; i < evt.changedTouches.length; i++) {
        var touch = evt.changedTouches[i];
        //look at each tile  
        for (var g = 0; g < board.tile.length; g++) {
            //check it's location vs the touch
            if (touch.pageX >= board.tile[g].X) {
                if (touch.pageX <= board.tile[g].X + board.tile[g].Width) {
                    if (touch.pageY >= board.tile[g].Y) {
                        if (touch.pageY <= board.tile[g].Y + board.tile[g].Height) {
                            //Get the position of the touch in comparison to the tile
                            board.tile[g].distX = touch.pageX - board.tile[g].X;
                            board.tile[g].distY = touch.pageY - board.tile[g].Y;
                            //select the tile
                            board.selectedTile[touch.identifier].tileNum = g
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
    for (var i = 0; i < evt.changedTouches.length; i++) {
        var touch = evt.changedTouches[i]
        if (board.selectedTile[touch.identifier].tileNum != null) {
            var path = board.selectedTile[touch.identifier].tileNum
            //move selected tiles
            board.tile[path].oldX = board.tile[path].X
            board.tile[path].oldY = board.tile[path].Y
            board.tile[path].X = evt.changedTouches[i].pageX - board.tile[path].distX;
            board.tile[path].Y = evt.changedTouches[i].pageY - board.tile[path].distY;
            //redraw tiles
            draw();
        }
    }
}

//When user let's go
function handleEnd(evt) {
    evt.preventDefault();
    //for each touch
    for (var i = 0; i < evt.changedTouches.length; i++) {
        var touch = evt.changedTouches[i];
        if (board.selectedTile[touch.identifier].tileNum != null) {
            var path = board.selectedTile[touch.identifier].tileNum
            board.tile[path].oldX = board.tile[path].X;
            board.tile[path].oldY = board.tile[path].Y;
            board.tile[path].X = (Math.floor((board.tile[path].X + 30) / 60) * 60) + 5
            board.tile[path].Y = (Math.floor((board.tile[path].Y + 30) / 60) * 60) + 5
            for (var g = 0; g < board.tile.length; g++) {
                if (path != g) {
                    if (board.tile[path].X === board.tile[g].X) {
                        if (board.tile[path].Y === board.tile[g].Y) {
                            board.tile[path].X = board.tile[path].previousX;
                            board.tile[path].Y = board.tile[path].previousY;
                        }
                    }
                }
            }
            board.tile[path].previousX = board.tile[path].X;
            board.tile[path].previousY = board.tile[path].Y;
            draw();
            board.selectedTile[touch.identifier].tileNum = null;
        }
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
    for (var f = 0; f < board.tile.length; f++) {
        ctx.clearRect(board.tile[f].oldX, board.tile[f].oldY, board.tile[f].Width, board.tile[f].Height);
    }
    for (var f = 0; f < board.tile.length; f++) {
        ctx.fillStyle = "brown";
        ctx.fillRect(board.tile[f].X, board.tile[f].Y, board.tile[f].Width, board.tile[f].Height);
        ctx.fillStyle = "black";
        ctx.fillText(board.tile[f].letter, board.tile[f].X + 2, board.tile[f].Y + 40);
    }
}

//At the start of the program
function init() {
    //declare variables
    var alphabet = "AAAAAAAAAAAAABBBCCCDDDDDDEEEEEEEEEEEEEEEEEEFFFGGGGHHHIIIIIIIIIIIIJJKKLLLLLLLLLLMMMNNNNNNNNOOOOOOOOOOOPPPQQRRRRRRRRRSSSSSSTTTTTTTTTUUUUUUVVVWWWXXYYYZZ";
    var number = [];
    var hold;
    //Set variables for each tile
    for (var i = 0; i < 8; i++) {
        number[i] = ((Math.random() * 144));
        for (var g = 0; g <= i; g++) {
            hold = Math.round(number[i]);
            if (number[g] === hold) {
                number[i] = ((Math.random() * 144));
                g = 0;
            }
        }
        number[i] = hold;
        board.tile[i] = { letter: alphabet.substring(number[i], number[i] + 1), X: 60 * (i + 1) + 5, Y: 545, Width: 50, Height: 50, distX: -1, distY: -1, oldX: 60 * (i + 1) + 5, oldY: 545, previousX: 60 * (i + 1), previousY: 545 };
        board.selectedTile[i] = { tileNum: null }
    }
}