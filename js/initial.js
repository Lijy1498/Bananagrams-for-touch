//Declare Variables
var board = { tile: [144], players: [8], previousTouchX: [], previousTouchY: [] };
for (var i = 0; i < 8; i++) {
    board.players[i] = { selectedTile: [], tilesInPlay: [7], peelReady: false, words: [], bananaReady: false, youWIN: false };
}
init();

//On a touch...
function handleStart(evt) {
    evt.preventDefault();
    //for each touch
    for (var i = 0; i < evt.changedTouches.length; i++) {
        var touch = evt.changedTouches[i];

        if (touch.pageX <= 225) {
            if (touch.pageY <= 60) {
                if (board.bananaReady) {
                    board.youWIN = true;
                    draw(1);
                }
            }
        }

        if (board.bananaReady === false) {
            //Peel
            //    if (board.peelReady) {
            if (touch.pageX >= 450) {
                if (touch.pageY <= 60) {
                    addTile(1);
                }
                //     }
            }
        }
        //look at each tile  
        for (var g = 0; g < board.players[1].tilesInPlay.length; g++) {
            //check it's location vs the touch
            var tiles = board.players[1].tilesInPlay[g];
            if (touch.pageX >= board.tile[tiles].X) {
                if (touch.pageX <= board.tile[tiles].X + board.tile[tiles].Width) {
                    if (touch.pageY >= board.tile[tiles].Y) {
                        if (touch.pageY <= board.tile[tiles].Y + board.tile[tiles].Height) {
                            //Get the position of the touch in comparison to the tile
                            board.tile[tiles].distX = touch.pageX - board.tile[tiles].X;
                            board.tile[tiles].distY = touch.pageY - board.tile[tiles].Y;
                            //select the tile
                            board.players[1].selectedTile[touch.identifier] = tiles;
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
    var counter = 0;

    //for each touch
    for (var i = 0; i < evt.changedTouches.length; i++) {
        var touch = evt.changedTouches[i]
        if (board.players[1].selectedTile[touch.identifier] != null) {
            var path = board.players[1].selectedTile[touch.identifier]
            //move selected tiles
            board.tile[path].X = evt.changedTouches[i].pageX - board.tile[path].distX;
            board.tile[path].Y = evt.changedTouches[i].pageY - board.tile[path].distY;
            //redraw tiles
            draw(1);
            if (counter === 0) {
                board.previousTouchX[touch.identifier] = board.tile[path].X;
                board.previousTouchY[touch.identifier] = board.tile[path].Y;
                counter = 20;
            } else {
                counter--;
            }
        }
    }
}

//When user let's go
function handleEnd(evt) {
    evt.preventDefault();
    //for each touch
    //    if (board.bananaReady === false) {
    for (var i = 0; i < evt.changedTouches.length; i++) {
        var touch = evt.changedTouches[i];
        if (board.players[1].selectedTile[touch.identifier] != null) {
            var path = board.players[1].selectedTile[touch.identifier]
            board.tile[path].X = (Math.floor((board.tile[path].X + 30) / 60) * 60) + 5;
            board.tile[path].Y = (Math.floor((board.tile[path].Y + 30) / 60) * 60) + 5;
            if (board.previousTouchY[touch.identifier] - board.tile[path].Y < -15) {
                board.tile[path].inPlay = false;
                board.tilesInPlay = board.tilesInPlay + 2;
                addTile(1);
                addTile(1);
                addTile(1);
            }
            var addition = 0;
            for (var g = 0; g < board.tilesInPlay; g++) {
                var tiles = board.players[1].tilesInPlay[g];
                if (path != tiles) {
                    if (board.tile[path].X === board.tile[tiles].X) {
                        if (board.tile[path].Y === board.tile[tiles].Y) {
                            if (board.tile[path].X === board.tile[tiles].X) {
                                board.tile[path].X = board.tile[path].previousX;
                                board.tile[path].Y = board.tile[path].previousY;
                            }
                        }
                    }
                }
            }
            if (board.tile[path].X < 0) {
                board.tile[path].X = board.tile[path].previousX;
                board.tile[path].Y = board.tile[path].previousY;
            }
            if (board.tile[path].X > 600) {
                board.tile[path].X = board.tile[path].previousX;
                board.tile[path].Y = board.tile[path].previousY;
            }
            if (board.tile[path].Y < 0) {
                board.tile[path].X = board.tile[path].previousX;
                board.tile[path].Y = board.tile[path].previousY;
            }
            if (board.tile[path].Y > 600) {
                board.tile[path].X = board.tile[path].previousX;
                board.tile[path].Y = board.tile[path].previousY;
            }
            if (board.tile[path].Y === 5) {
                if (board.tile[path].X >= 450) {
                    board.tile[path].X = board.tile[path].previousX;
                    board.tile[path].Y = board.tile[path].previousY;
                }
            }

            //Peel check
            var wordCount = -1;
            var addition = 0;
            var wordHold = "";
            var peel = true;
            for (var h = 0; h < board.players[1].words.length; h++) {
                board.players[1].words[h] = null;
            }
            if (peel === true) {
                for (var x = 5; x <= 600; x = x + 60) {
                    for (var y = 5; y < 600; y = y + 60) {
                        for (var g = 0; g < board.players[1].tilesInPlay.length; g++) {
                            var tiles = board.players[1].tilesInPlay[g];
                            if (peel === true) {
                                if (board.tile[tiles].X === x && board.tile[tiles].Y === y) {
                                    wordHold = wordHold + board.tile[tiles].letter;
                                    break;
                                } else if (g === board.players[1].tilesInPlay.length - 1) {
                                    if (wordHold.length === 1) {
                                        var notAWord = true;
                                        for (var f = 0; f < board.players[1].tilesInPlay.length; f++) {
                                            var tiles2 = board.players[1].tilesInPlay[f];
                                            if (board.tile[tiles2].Y === y - 60) {
                                                if (board.tile[tiles2].X === x - 60) {
                                                    notAWord = false
                                                    wordHold = "";
                                                } else if (board.tile[tiles2].X === x + 60) {
                                                    notAWord = false
                                                    wordHold = "";
                                                }
                                            }
                                        }
                                        if (notAWord === true) {
                                            peel = false;
                                            wordHold = "";
                                        }
                                    } else if (wordHold.length > 1) {
                                        wordCount++;
                                        board.players[1].words[wordCount] = wordHold;
                                        wordHold = "";
                                    }
                                }
                            }
                        }
                    }
                }
                if (peel != false) {
                    for (var y = 5; y <= 600; y = y + 60) {
                        for (var x = 5; x <= 600; x = x + 60) {
                            for (var g = 0; g < board.players[1].tilesInPlay.length; g++) {
                                var tiles = board.players[1].tilesInPlay[g];
                                if (board.tile[tiles].X === x && board.tile[tiles].Y === y) {
                                    wordHold = wordHold + board.tile[tiles].letter;
                                    break;
                                } else if (g === board.players[1].tilesInPlay.length - 1) {
                                    if (wordHold.length === 1) {
                                        var notAWord = true;
                                        for (var f = 0; f < board.players[1].tilesInPlay.length; f++) {
                                            var tiles2 = board.players[1].tilesInPlay[f];
                                            if (board.tile[tiles2].X === x - 60) {
                                                if (board.tile[tiles2].Y === y + 60) {
                                                    notAWord = false
                                                    wordHold = "";
                                                } else if (board.tile[tiles2].Y === y - 60) {
                                                    notAWord = false
                                                    wordHold = "";
                                                }
                                            }
                                        }
                                        if (notAWord === true) {
                                            peel = false;
                                            wordHold = "";
                                        }
                                    } else if (wordHold.length > 1) {
                                        wordCount++;
                                        board.players[1].words[wordCount] = wordHold;
                                        wordHold = "";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            addition = 0;
            if (peel != false) {
                for (var f = 0; f <= wordCount; f++) {
                    var holding = board.players[1].words[f].toLowerCase();
                    if (dictionary[holding]) {
                        if (f === wordCount) {
                            if (peel === true) {
                                var testing = true;
                                var progress = 0;
                                board.tile[0].checked = true;
                                while (testing === true) {
                                    for (var g = 0; g < board.players[1].tilesInPlay.length; g++) {
                                        var tiles = board.players[1].tilesInPlay[g];
                                        if (board.tile[tiles].checked === true) {
                                            var additionV2 = 0;
                                            for (var h = 0; h < board.players[1].tilesInPlay.length; h++) {
                                                var tiles2 = board.players[1].tilesInPlay[h];
                                                if (board.tile[tilesV2].checked === false) {
                                                    if (board.tile[tiles].X === board.tile[tiles2].X) {
                                                        if (board.tile[tiles].Y === board.tile[tiles2].Y + 60) {
                                                            board.tile[tiles2].checked = true;
                                                            g = 0;
                                                        } else if (board.tile[tiles].Y === board.tile[tiles2].Y - 60) {
                                                            board.tile[tiles2].checked = true;
                                                            g = 0;
                                                        }
                                                    }
                                                    if (board.tile[tiles].Y === board.tile[tiles2].Y) {
                                                        if (board.tile[tiles].X === board.tile[tiles2].X + 60) {
                                                            board.tile[tiles2].checked = true;
                                                            g = 0;
                                                        } else if (board.tile[tiles].X === board.tile[tiles2].X - 60) {
                                                            board.tile[tiles2].checked = true;
                                                            g = 0;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    for (var h = 0; h < board.tilesInPlay; h++) {
                                        var tiles = board.players[1].tilesInPlay[h];
                                        if (board.tile[tiles].checked === false) {
                                            testing = false;
                                            board.peelReady = false;
                                        } else if (h === board.tilesInPlay - 1 && testing === true) {
                                            testing = false;
                                            board.peelReady = true;
                                            if (board.tilesInPlay >= 15) {
                                                board.peelReady = false;
                                                board.bananaReady = true;
                                            }
                                        }
                                        board.tile[tiles].checked = false;
                                    }
                                }
                            }
                        }
                    } else {
                        peel = false;
                        board.peelReady = false;
                    }
                }
            } else {
                board.peelReady = false;
            }


            board.tile[path].previousX = board.tile[path].X;
            board.tile[path].previousY = board.tile[path].Y;
            draw(1);
            board.players[1].selectedTile[touch.identifier] = null;
        }
    }
}
//}

//declare events
var el = document.getElementById("canvas");
el.addEventListener("touchstart", handleStart, false);
el.addEventListener("touchmove", handleMove, false);
el.addEventListener("touchend", handleEnd, false);

//Redraw the frame
function draw(player) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.font = "48px serif";
    ctx.clearRect(0, 0, 600, 600);
    if (board.youWIN) {
        ctx.fillStyle = "black";
        ctx.fillText("A WINNER IS YOU!", 100, 300);
    } else {
        if (board.peelReady === true) {
            ctx.fillStyle = "lightGreen";
            ctx.fillRect(450, 0, 600, 54);
        }
        else {
            ctx.fillStyle = "grey";
            ctx.fillRect(450, 0, 600, 54);
        }
        ctx.fillStyle = "black";
        ctx.fillText("PEEL", 460, 45);
        ctx.fillRect(449, 54, 600, 1);
        ctx.fillRect(449, 0, 1, 55);

        for (var f = 0; f < board.players[player].tilesInPlay.length - 1; f++) {
            var path = board.players[player].tilesInPlay[f];
            ctx.fillRect(board.tile[path].X, board.tile[path].Y, board.tile[path].Width, board.tile[path].Height);
            ctx.clearRect(board.tile[path].X + 1, board.tile[path].Y + 1, board.tile[path].Width - 2, board.tile[path].Height - 2);
            ctx.fillText(board.tile[path].letter, board.tile[path].X + 2, board.tile[path].Y + 40);
        }

        if (board.bananaReady === true) {
            ctx.fillStyle = "black";
            ctx.fillText("BANANA", 5, 45);
            ctx.fillRect(0, 54, 225, 1);
            ctx.fillRect(224, 0, 1, 55);
        }
    }
}

function move(delta, duration, toX, toY, animatedTile, holdX, holdY) {

    animate({
        delay: 10,
        duration: duration || 2000,
        delta: delta,
        step: function (delta) {
            board.tile[animatedTile].X = (toX * delta) + holdX;
            board.tile[animatedTile].Y = (toY * delta) + holdY;
            draw(1);
        }
    })
}

function animate(opts) {
    var start = new Date
    var id = setInterval(function () {
        var timePassed = new Date - start
        var progress = timePassed / opts.duration
        if (progress > 1) progress = 1
        opts.step(progress)
        if (progress == 1) {
            clearInterval(id)
        }
    }, opts.delay || 10)
}

function addTile(player) {
    var hold;
    for (var g = 0; g < board.players.length; g++) {
        hold = hold + board.players[g].tilesInPlay.length;
    };
    var holdNum = Math.round((Math.random() * (144 - hold)));
    var addition = 0;

    for (var h = 0; h <= holdNum; h++) {
        if (board.tile[h + addition].inPlay) {
            addition++;
            h--;
        } else {
            if (h === holdNum) {
                hold = h + addition;
            }
        }
    }

    board.players[player].tilesInPlay[board.players[player].tilesInPlay.length] = hold;


    board.tile[hold].X = 5;
    board.tile[hold].Y = 65;
    for (var g = 0; g <= board.tilesInPlay; g++) {
        var tiles = board.players[1].tilesInPlay[g];
        if (board.tile[hold - 1].X === board.tile[tiles].X) {
            if (board.tile[hold - 1].Y === board.tile[tiles].Y) {
                board.tile[hold - 1].X = board.tile[hold - 1].X + 60;
                if (board.tile[hold - 1].X >= 600) {
                    board.tile[hold - 1].Y = board.tile[hold - 1].Y + 60;
                    board.tile[hold - 1].X = 5;
                }
                g = 0;
            }
        }
    }
    addition = 0;
    board.peelReady = false;
    board.tile[hold - 1].previousX = board.tile[hold - 1].X;
    board.tile[hold - 1].previousY = board.tile[hold - 1].Y;
    move(function (p) { return p }, 250, board.tile[hold].X - 300, board.tile[hold].Y + 65, hold - 1, 300, -65);
    board.tile[hold - 1].X = 300;
    board.tile[hold - 1].Y = -65;
    board.tile[hold - 1].inPlay = true;
    board.players[player].tilesInPlay = board.tilesInPlay + 1;
}

//At the start of the program
function init() {
    //declare variables
    var alphabet = "AAAAAAAAAAAAABBBCCCDDDDDDEEEEEEEEEEEEEEEEEEFFFGGGGHHHIIIIIIIIIIIIJJKKLLLLLLLLLLMMMNNNNNNNNOOOOOOOOOOOPPPQQRRRRRRRRRSSSSSSTTTTTTTTTUUUUUUVVVWWWXXYYYZZ";
    var number = [];
    var hold;
    //var path = board.players[player].tilesInPlay[f];
    //Set variables for each tile
    for (var i = 0; i < 144; i++) {

        number[i] = ((Math.random() * 144));
        for (var g = 0; g <= i; g++) {
            hold = Math.round(number[i]);
            if (number[g] === hold) {
                number[i] = ((Math.random() * 144));
                g = 0;
            }
        }

        number[i] = hold;
        board.tile[i] = { letter: alphabet.substring(number[i], number[i] + 1), X: 300, Y: -65, Width: 50, Height: 50, distX: -1, distY: -1, previousX: 4 * (i + 1) + 5, previousY: 545, checked: false, inPlay: false };
    }

    board.players[1].tilesInPlay[0] = 0;
    board.players[1].tilesInPlay[1] = 1;
    board.players[1].tilesInPlay[2] = 2;
    board.players[1].tilesInPlay[3] = 3;
    board.players[1].tilesInPlay[4] = 4;
    board.players[1].tilesInPlay[5] = 5;
    board.players[1].tilesInPlay[6] = 6;
    board.players[1].tilesInPlay[7] = 7;
    board.players[1].tilesInPlay[8] = 8;


    var addition = 0;
    for (var h = 0; h < board.players[1].tilesInPlay.length; h++) {
        board.tile[h].inPlay = true;
        number[h] = ((Math.random() * 9));
        hold = Math.round(number[h]);
        board.tile[h].X = 60 * (hold) + 5;
        board.tile[h].previousX = 60 * (hold) + 5;

        number[h] = ((Math.random() * 8));
        hold = Math.round(number[h]);
        board.tile[h].Y = 60 * (hold) + 65;
        board.tile[h].previousY = 60 * (hold) + 65;

        for (var g = 0; g < h; g++) {
            if (board.tile[h].X === board.tile[g].X) {
                if (board.tile[h].Y === board.tile[g].Y) {
                    number[h] = ((Math.random() * 10));
                    hold = Math.round(number[h]);
                    board.tile[h].X = 60 * (hold) + 5;
                    board.tile[h].previousX = 60 * (hold) + 5;

                    number[h] = ((Math.random() * 9));
                    hold = Math.round(number[h]);
                    board.tile[h].Y = 60 * (hold) + 65;
                    board.tile[h].previousY = 60 * (hold) + 65;

                    g = 0;
                }
            }
        }
    }
    //For testing
    /*
    board.tile[0].letter = "G"
    board.tile[1].letter = "O"
    board.tile[2].letter = "A"
    board.tile[3].letter = "L"
    board.tile[4].letter = "G"
    board.tile[5].letter = "A"
    board.tile[6].letter = "L"
    board.tile[7].letter = "A"
    */
    draw(1);
}