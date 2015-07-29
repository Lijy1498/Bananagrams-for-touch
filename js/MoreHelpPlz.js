//Declare Variables
var board = { tile: [], selectedTile: [], tilesInPlay: 8, peelReady: false, words: [] };
var difference;
var selectedTile;
var distanceX;
var distanceY;

init();

//On a touch...
function handleStart(evt) {
    evt.preventDefault();
    //for each touch
    for (var i = 0; i < evt.changedTouches.length; i++) {
        var touch = evt.changedTouches[i];
        //Peel
        if (touch.pageX >= 450) {
            if (touch.pageY <= 60) {
                board.tilesInPlay = board.tilesInPlay + 1;
                board.tile[board.tilesInPlay].newX = 5;
                board.tile[board.tilesInPlay].Y = 65;
                for (var g = 0; g < board.tilesInPlay; g++) {
                    if (board.tile[board.tilesInPlay].newX === board.tile[g].X) {
                        if (board.tile[board.tilesInPlay].Y === board.tile[g].Y) {
                            board.tile[board.tilesInPlay].newX = board.tile[board.tilesInPlay].X + 60;
                            if (board.tile[board.tilesInPlay].newX >= 600) {
                                board.tile[board.tilesInPlay].Y = board.tile[board.tilesInPlay].Y + 60;
                                board.tile[board.tilesInPlay].newX = 5;
                            }

                            g = 0;
                        }
                    }
                }
                board.peelReady = false;
                selectedTile = board.tilesInPlay;
                move(function (p) { return p }, 2000, board.tile[board.tilesInPlay].newX - board.tile[board.tilesInPlay].X, board.tile[board.tilesInPlay].newY - board.tile[board.tilesInPlay].Y);
            }
        }
        //look at each tile  
        for (var g = 0; g < board.tilesInPlay; g++) {
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

            for (var g = 0; g < board.tilesInPlay; g++) {
                if (path != g) {
                    if (board.tile[path].X === board.tile[g].X) {
                        if (board.tile[path].Y === board.tile[g].Y) {
                            if (board.tile[path].X === board.tile[g].X) {
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

            //Dump
            if (board.tile[path].Y === 5) {
                if (board.tile[path].X < 450) {
                    board.tile[path].X = 5;
                    board.tile[path].Y = 65;
                    board.tile[board.tilesInPlay + 1].X = 65;
                    board.tile[board.tilesInPlay + 1].Y = 65;
                    board.tile[board.tilesInPlay + 2].X = 125;
                    board.tile[board.tilesInPlay + 2].Y = 65;
                    for (var h = 0; h < 3; h++) {
                        var hold;
                        if (h === 0) {
                            hold = path;
                        } else {
                            hold = board.tilesInPlay + h;
                        }
                        for (var g = 0; g < board.tilesInPlay + 2; g++) {
                            if (hold != g) {
                                if (board.tile[hold].X === board.tile[g].X) {
                                    if (board.tile[hold].Y === board.tile[g].Y) {
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

                    var stringHold = board.tile[path].letter;
                    board.tile[path].letter = board.tile[board.tile.length - board.tilesInPlay].letter;
                    board.tile[board.tile.length - board.tilesInPlay].letter = stringHold;
                    board.tilesInPlay = board.tilesInPlay + 2;
                }
            }

            //Peel check
            var wordCount = -1;
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
                                if (board.tile[g].X === x && board.tile[g].Y === y) {
                                    wordHold = wordHold + board.tile[g].letter;
                                    break;
                                } else if (g === board.tilesInPlay - 1) {
                                    if (wordHold.length === 1) {
                                        var notAWord = true;
                                        for (var f = 0; f < board.tilesInPlay; f++) {
                                            if (board.tile[f].Y === y - 60) {
                                                if (board.tile[f].X === x - 60) {
                                                    notAWord = false
                                                    wordHold = "";
                                                } else if (board.tile[f].X === x + 60) {
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
                                        board.words[wordCount] = wordHold;
                                        wordHold = "";
                                    }
                                }
                            }
                        }
                    }
                }
                if (peel != false) {
                    for (var y = 65; y <= 545; y = y + 60) {
                        for (var x = 5; x <= 545; x = x + 60) {
                            for (var g = 0; g < board.tilesInPlay; g++) {
                                if (peel === true) {
                                    if (board.tile[g].X === x && board.tile[g].Y === y) {
                                        wordHold = wordHold + board.tile[g].letter;
                                        break;
                                    } else if (g === board.tilesInPlay - 1) {
                                        if (wordHold.length === 1) {
                                            var notAWord = true;
                                            for (var f = 0; f < board.tilesInPlay; f++) {
                                                if (board.tile[f].X === x - 60) {
                                                    if (board.tile[f].Y === y + 60) {
                                                        notAWord = false
                                                        wordHold = "";
                                                    } else if (board.tile[f].Y === y - 60) {
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
                                        if (board.tile[g].checked === true) {
                                            for (var h = 0; h < board.tilesInPlay; h++) {
                                                if (board.tile[h].checked === false) {
                                                    if (board.tile[g].X === board.tile[h].X) {
                                                        if (board.tile[g].Y === board.tile[h].Y + 60) {
                                                            board.tile[h].checked = true;
                                                            g = 0;
                                                        } else if (board.tile[g].Y === board.tile[h].Y - 60) {
                                                            board.tile[h].checked = true;
                                                            g = 0;
                                                        }
                                                    }
                                                    if (board.tile[g].Y === board.tile[h].Y) {
                                                        if (board.tile[g].X === board.tile[h].X + 60) {
                                                            board.tile[h].checked = true;
                                                            g = 0;
                                                        } else if (board.tile[g].X === board.tile[h].X - 60) {
                                                            board.tile[h].checked = true;
                                                            g = 0;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    for (var h = 0; h < board.tilesInPlay; h++) {
                                        if (board.tile[h].checked === false) {
                                            testing = false;
                                            board.peelReady = false;
                                        } else if (h === board.tilesInPlay - 1) {
                                            testing = false;
                                            board.peelReady = true;
                                        }
                                        board.tile[h].checked = false;
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
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 449, 54);
    if (board.peelReady === true) {
        ctx.fillStyle = "lightGreen";
        ctx.fillRect(450, 0, 600, 54);
    }
    else {
        ctx.fillStyle = "grey";
        ctx.fillRect(450, 0, 600, 54);
    }
    ctx.fillStyle = "black";
    ctx.fillText("DUMP ZONE        PEEL", 90, 45);
    ctx.fillRect(0, 54, 600, 1);
    ctx.fillRect(449, 0, 1, 55);
    for (var f = 0; f < board.tilesInPlay; f++) {
        ctx.fillStyle = "black";
        ctx.fillRect(board.tile[f].X, board.tile[f].Y, board.tile[f].Width, board.tile[f].Height);
        ctx.fillStyle = "brown";
        ctx.fillRect(board.tile[f].X + 1, board.tile[f].Y + 1, board.tile[f].Width - 2, board.tile[f].Height - 2);
        ctx.fillStyle = "black";
        ctx.fillText(board.tile[f].letter, board.tile[f].X + 2, board.tile[f].Y + 40);
    }
}

function move(delta, duration, distanceX, distanceY) {
    var toX = distanceX;
    var toY = distanceY;
    var holdX = 300;
    var holdY = -65;

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
        if (progress == 2) {
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
        board.tile[i] = { letter: alphabet.substring(number[i], number[i] + 1), X: 300, Y: -65, Width: 50, Height: 50, distX: -1, distY: -1, oldX: 60 * (i + 1) + 5, oldY: 545, previousX: 4 * (i + 1) + 5, previousY: 545, startX: 4 * (i + 1) + 5, checked: false, newX : null, newY: null};

        board.selectedTile[i] = { tileNum: null }
    }
    for (var h = 0; h < board.tilesInPlay; h++) {
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