//Declare Variables
var board = { tile: [], selectedTile: [], tilesInPlay: 8, peelReady: false, words: [], previousTouchX: [], previousTouchY: [] };
var difference;
var distanceX;
var distanceY;
var counter = 0;

init();

//On a touch...
function handleStart(evt) {
    evt.preventDefault();
    //for each touch
    for (var i = 0; i < evt.changedTouches.length; i++) {
        var touch = evt.changedTouches[i];
        //Peel
        //    if (board.peelReady) {
        if (touch.pageX >= 450) {
            if (touch.pageY <= 60) {
                var holdNum = Math.round((Math.random() * (144 - board.tilesInPlay)));
                var addition = 0;
                var hold;
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

                board.tile[hold].X = 5;
                board.tile[hold].Y = 65;
                addition = 0;
                for (var g = 0; g < board.tilesInPlay - 1; g++) {
                    if (g + addition < 144) {
                        if (board.tile[g + addition].inPlay === false) {
                            addition++;
                            g--;
                        } else {
                            if (board.tile[hold].X === board.tile[g + addition].X) {
                                if (board.tile[hold].Y === board.tile[g + addition].Y) {
                                    board.tile[hold].X = board.tile[hold].X + 60;
                                    if (board.tile[hold].X >= 600) {
                                        board.tile[hold].Y = board.tile[hold].Y + 60;
                                        board.tile[hold].X = 5;
                                    }
                                    g = 0;
                                }
                            }
                        }
                    }
                }
                addition = 0;
                board.peelReady = false;
                move(function (p) { return p }, 250, board.tile[hold].X - 300, board.tile[hold].Y + 65, hold - 1, 300, -65);
                board.tile[hold - 1].X = 300;
                board.tile[hold - 1].Y = -65;
                board.tile[hold - 1].inPlay = true;
                board.tilesInPlay = board.tilesInPlay + 1;
            }
            //     }
        }
        var addition = 0;
        //look at each tile  
        for (var g = 0; g < board.tilesInPlay; g++) {
            if (g + addition < 144) {
                if (board.tile[g + addition].inPlay === false) {
                    addition++;
                    g--;
                } else {
                    //check it's location vs the touch
                    if (touch.pageX >= board.tile[g + addition].X) {
                        if (touch.pageX <= board.tile[g + addition].X + board.tile[g + addition].Width) {
                            if (touch.pageY >= board.tile[g + addition].Y) {
                                if (touch.pageY <= board.tile[g + addition].Y + board.tile[g + addition].Height) {
                                    //Get the position of the touch in comparison to the tile
                                    board.tile[g + addition].distX = touch.pageX - board.tile[g + addition].X;
                                    board.tile[g + addition].distY = touch.pageY - board.tile[g + addition].Y;
                                    //select the tile
                                    board.selectedTile[touch.identifier].tileNum = g + addition;
                                    break;
                                }
                            }
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
            if (counter === 50) {
                board.previousTouchX[touch.identifier] = board.tile[path].X;
                board.previousTouchY[touch.identifier] = board.tile[path].Y;
            } else {
                counter++;
            }
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
            if (board.previousTouchY[touch.identifier] - board.tile[path].oldY < -20) {
                board.tile[path].inPlay = false;
                board.tilesInPlay = board.tilesInPlay + 2;
                var addition = 0;
                var holdIt = [];
                for (var g = 0; g < 3; g++) {
                    var hold1 = Math.round((Math.random() * (144 - board.tilesInPlay)));
                    for (var h = 0; h <= hold1; h++) {
                        if (board.tile[h + addition].inPlay) {
                            addition++;
                            h--;
                        } else {
                            if (h === hold1) {
                                holdIt[g] = h + addition;
                            }
                        }
                    }
                    board.tile[holdIt[g]].X = 5;
                    board.tile[holdIt[g]].Y = 65;
                    board.tile[holdIt[g]].inPlay = true;
                    addition = 0;
                }

                for (var h = 0; h < 3; h++) {
                    for (var g = 0; g <= board.tilesInPlay; g++) {
                        if (g + addition < 144) {
                            if (board.tile[g + addition].inPlay === false) {
                                addition++;
                                g--;
                            } else if (holdIt[h] != g + addition) {
                                if (board.tile[holdIt[h]].X === board.tile[g + addition].X) {
                                    if (board.tile[holdIt[h]].Y === board.tile[g + addition].Y) {
                                        board.tile[holdIt[h]].X = board.tile[holdIt[h]].X + 60;
                                        if (board.tile[holdIt[h]].X >= 600) {
                                            board.tile[holdIt[h]].Y = board.tile[holdIt[h]].Y + 60;
                                            board.tile[holdIt[h]].X = 5;
                                        }

                                        g = 0;
                                    }
                                }
                            }
                        }
                    }
                    addition = 0;
                }

                var stringHold = board.tile[path].letter;
                board.tile[path].letter = board.tile[board.tile.length - board.tilesInPlay].letter;
                board.tile[board.tile.length - board.tilesInPlay].letter = stringHold;
                move(function (p) { return p }, 250, board.tile[path].X - 300, board.tile[path].Y + 65, path, 300, -65);
                board.tile[path].X = 300;
                board.tile[path].Y = -65;
                move(function (p) { return p }, 250, board.tile[board.tilesInPlay + 1].X - 300, board.tile[board.tilesInPlay + 1].Y + 65, board.tilesInPlay + 1, 300, -65);
                board.tile[board.tilesInPlay + 1].X = 300;
                board.tile[board.tilesInPlay + 1].Y = -65;
                move(function (p) { return p }, 250, board.tile[board.tilesInPlay + 2].X - 300, board.tile[board.tilesInPlay + 2].Y + 65, board.tilesInPlay + 2, 300, -65);
                board.tile[board.tilesInPlay + 2].X = 300;
                board.tile[board.tilesInPlay + 2].Y = -65;

                board.tilesInPlay = board.tilesInPlay + 3;

            }
            board.tile[path].oldX = board.tile[path].X;
            board.tile[path].oldY = board.tile[path].Y;
            board.tile[path].X = (Math.floor((board.tile[path].X + 30) / 60) * 60) + 5
            board.tile[path].Y = (Math.floor((board.tile[path].Y + 30) / 60) * 60) + 5
            var addition = 0;
            for (var g = 0; g < board.tilesInPlay; g++) {
                if (g + addition < 144) {
                    if (board.tile[g + addition].inPlay === false) {
                        addition++;
                        g--;
                    } else if (path != g + addition) {
                        if (board.tile[path].X === board.tile[g + addition].X) {
                            if (board.tile[path].Y === board.tile[g + addition].Y) {
                                if (board.tile[path].X === board.tile[g + addition].X) {
                                    board.tile[path].X = board.tile[path].previousX;
                                    board.tile[path].Y = board.tile[path].previousY;
                                }
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
            for (var h = 0; h < board.words.length; h++) {
                board.words[h] = null;
            }
            if (peel === true) {
                for (var x = 5; x <= 545; x = x + 60) {
                    for (var y = 65; y < 600; y = y + 60) {
                        for (var g = 0; g < board.tilesInPlay; g++) {
                            if (peel === true) {
                                if (g + addition < 144) {
                                    if (board.tile[g + addition].inPlay === false) {
                                        addition++;
                                        g--;
                                    } else if (board.tile[g + addition].X === x && board.tile[g + addition].Y === y) {
                                        wordHold = wordHold + board.tile[g + addition].letter;
                                        break;
                                    } else if (g === board.tilesInPlay - 1) {
                                        if (wordHold.length === 1) {
                                            var notAWord = true;
                                            for (var f = 0; f < board.tilesInPlay; f++) {
                                                if (f + addition < 144) {
                                                    if (board.tile[f + addition].inPlay === false) {
                                                        addition++;
                                                        f--;
                                                    } else if (board.tile[f + addition].Y === y - 60) {
                                                        if (board.tile[f + addition].X === x - 60) {
                                                            notAWord = false
                                                            wordHold = "";
                                                        } else if (board.tile[f + addition].X === x + 60) {
                                                            notAWord = false
                                                            wordHold = "";
                                                        }
                                                    }
                                                }
                                            }
                                            if (notAWord === true) {
                                                peel = false;
                                                wordHold = "";
                                            }
                                        } else if (wordHold.length > 1) {
                                            wordCount++;
                                            board.words[wordCount] = wordHold;
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
                    for (var y = 65; y <= 545; y = y + 60) {
                        for (var x = 5; x <= 545; x = x + 60) {
                            for (var g = 0; g < board.tilesInPlay; g++) {
                                if (peel === true) {
                                    if (g + addition < 144) {
                                        if (board.tile[g + addition].inPlay === false) {
                                            addition++;
                                            g--;
                                        } else if (board.tile[g + addition].X === x && board.tile[g + addition].Y === y) {
                                            wordHold = wordHold + board.tile[g + addition].letter;
                                            break;
                                        } else if (g === board.tilesInPlay - 1) {
                                            if (wordHold.length === 1) {
                                                var notAWord = true;
                                                for (var f = 0; f < board.tilesInPlay; f++) {
                                                    if (f + addition < 144) {
                                                        if (board.tile[f + addition].inPlay === false) {
                                                            addition++;
                                                            f--;
                                                        } else if (board.tile[f + addition].X === x - 60) {
                                                            if (board.tile[f + addition].Y === y + 60) {
                                                                notAWord = false
                                                                wordHold = "";
                                                            } else if (board.tile[f + addition].Y === y - 60) {
                                                                notAWord = false
                                                                wordHold = "";
                                                            }
                                                        }
                                                    }
                                                }
                                                if (notAWord === true) {
                                                    peel = false;
                                                    wordHold = "";
                                                }
                                            } else if (wordHold.length > 1) {
                                                wordCount++;
                                                board.words[wordCount] = wordHold;
                                                wordHold = "";
                                            }
                                        }
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
                    var holding = board.words[f].toLowerCase();
                    if (dictionary[holding]) {
                        if (f === wordCount) {
                            if (peel === true) {
                                var testing = true;
                                var progress = 0;
                                board.tile[0].checked = true;
                                while (testing === true) {
                                    for (var g = 0; g < board.tilesInPlay; g++) {
                                        if (g + addition < 144) {
                                            if (board.tile[g + addition].inPlay === false) {
                                                addition++;
                                                g--;
                                            } else if (board.tile[g + addition].checked === true) {
                                                for (var h = 0; h < board.tilesInPlay; h++) {
                                                    if (h + addition < 144) {
                                                        if (board.tile[h + addition].inPlay === false) {
                                                            addition++;
                                                            h--;
                                                        } else if (board.tile[h].checked === false) {
                                                            if (board.tile[g + addition].X === board.tile[h + addition].X) {
                                                                if (board.tile[g + addition].Y === board.tile[h + addition].Y + 60) {
                                                                    board.tile[h + addition].checked = true;
                                                                    g = 0;
                                                                } else if (board.tile[g + addition].Y === board.tile[h + addition].Y - 60) {
                                                                    board.tile[h + addition].checked = true;
                                                                    g = 0;
                                                                }
                                                            }
                                                            if (board.tile[g + addition].Y === board.tile[h + addition].Y) {
                                                                if (board.tile[g + addition].X === board.tile[h + addition].X + 60) {
                                                                    board.tile[h + addition].checked = true;
                                                                    g = 0;
                                                                } else if (board.tile[g + addition].X === board.tile[h + addition].X - 60) {
                                                                    board.tile[h + addition].checked = true;
                                                                    g = 0;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    addition = 0;
                                    for (var h = 0; h < board.tilesInPlay; h++) {
                                        if (h + addition < 144) {
                                            if (board.tile[h + addition].inPlay === false) {
                                                addition++;
                                                h--;
                                            } else {
                                                if (board.tile[h + addition].checked === false) {
                                                    testing = false;
                                                    board.peelReady = false;
                                                } else if (h === board.tilesInPlay - 1) {
                                                    testing = false;
                                                    board.peelReady = true;
                                                }
                                                board.tile[h + addition].checked = false;
                                            }
                                        }
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
    ctx.clearRect(0, 0, 600, 600);
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

    var addition = 0;
    for (var f = 0; f <= board.tilesInPlay - 1; f++) {
        if (f + addition < 144) {
            if (board.tile[f + addition].inPlay) {
                ctx.fillStyle = "black";
                ctx.fillRect(board.tile[f + addition].X, board.tile[f + addition].Y, board.tile[f + addition].Width, board.tile[f + addition].Height);
                ctx.clearRect(board.tile[f + addition].X + 1, board.tile[f + addition].Y + 1, board.tile[f + addition].Width - 2, board.tile[f + addition].Height - 2);
                ctx.fillText(board.tile[f + addition].letter, board.tile[f + addition].X + 2, board.tile[f + addition].Y + 40);
            } else {
                addition++;
                f--;
            }
        }
    }
}

function move(delta, duration, distanceX, distanceY, selectedTile, startX, startY) {
    var toX = distanceX;
    var toY = distanceY;
    var holdX = startX;
    var holdY = startY;

    animate({
        delay: 10,
        duration: duration || 2000,
        delta: delta,
        step: function (delta) {
            board.tile[selectedTile].X = (toX * delta) + holdX;
            board.tile[selectedTile].Y = (toY * delta) + holdY;
            draw();
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

//At the start of the program
function init() {
    //declare variables
    var alphabet = "AAAAAAAAAAAAABBBCCCDDDDDDEEEEEEEEEEEEEEEEEEFFFGGGGHHHIIIIIIIIIIIIJJKKLLLLLLLLLLMMMNNNNNNNNOOOOOOOOOOOPPPQQRRRRRRRRRSSSSSSTTTTTTTTTUUUUUUVVVWWWXXYYYZZ";
    var number = [];
    var hold;
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
        board.tile[i] = { letter: alphabet.substring(number[i], number[i] + 1), X: 300, Y: -65, Width: 50, Height: 50, distX: -1, distY: -1, oldX: 60 * (i + 1) + 5, oldY: 545, previousX: 4 * (i + 1) + 5, previousY: 545, startX: 4 * (i + 1) + 5, checked: false, newX: null, newY: null, inPlay: false };

        board.selectedTile[i] = { tileNum: null }
    }
    var addition = 0;
    for (var h = 0; h < board.tilesInPlay; h++) {
        board.tile[h].inPlay = true;
        number[h] = ((Math.random() * 9));
        hold = Math.round(number[h]);
        board.tile[h].X = 60 * (hold) + 5;
        board.tile[h].oldX = 60 * (hold) + 5;
        board.tile[h].previousX = 60 * (hold) + 5;

        number[h] = ((Math.random() * 8));
        hold = Math.round(number[h]);
        board.tile[h].Y = 60 * (hold) + 65;
        board.tile[h].oldY = 60 * (hold) + 65;
        board.tile[h].previousY = 60 * (hold) + 65;

        for (var g = 0; g < h; g++) {
            if (board.tile[h].X === board.tile[g].X) {
                if (board.tile[h].Y === board.tile[g].Y) {
                    number[h] = ((Math.random() * 10));
                    hold = Math.round(number[h]);
                    board.tile[h].X = 60 * (hold) + 5;
                    board.tile[h].oldX = 60 * (hold) + 5;
                    board.tile[h].previousX = 60 * (hold) + 5;

                    number[h] = ((Math.random() * 9));
                    hold = Math.round(number[h]);
                    board.tile[h].Y = 60 * (hold) + 65;
                    board.tile[h].oldY = 60 * (hold) + 65;
                    board.tile[h].previousY = 60 * (hold) + 65;

                    g = 0;
                }
            }
        }
    }
    draw();
}