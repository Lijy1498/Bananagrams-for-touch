var ongoingTouches = new Array();

var boxX = 50
var boxY = 50
var sizeX = 50
var sizeY = 50
var distX
var distY
var firstTouch = false
var tile = []
tile = {letter:0, posX:0, posY:500}

init()
draw()

var box1 = document.getElementById('box2'), boxleft, startx, dist = 0, touchobj = null

function handleStart(evt) {
  evt.preventDefault();
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;
  firstTouch = true;
  distX = touches[0].pageX-boxX
  distY = touches[0].pageY-boxY
}

function handleMove(evt) {
  evt.preventDefault();
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;
  if (firstTouch === true)
  {	
	if (touches[0].pageX >= boxX - 20)
	{
		if (touches[0].pageX <= boxX + 70)
		{
			if (touches[0].pageY >= boxY - 20)
			{
				if (touches[0].pageY <= boxY + 70)
				{
					boxX = touches[0].pageX - distX
					boxY = touches[0].pageY - distY
					draw()
				}
				else
				{
				firstTouch = false
				}
			}
			else
			{
			firstTouch = false
			}
		}
		else
		{
		firstTouch = false
		}
	}
	else
	{
	firstTouch = false
	}
  }
}

var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchmove", handleMove, false)

function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');   
    ctx.clearRect(0,0,600,600)
    ctx.fillStyle = "brown";
    ctx.fillRect(boxX,boxY,sizeX,sizeY);
    ctx.font = "48px serif";
    ctx.fillStyle = "black";
    boxX = boxX+5;
    boxY = boxY+40;
    ctx.fillText(tile.letter[1],boxX,boxY);
    boxX = boxX-5;
    boxY = boxY-40; 
 }
}

function init() {
  var number = []
  for (var i = 0; i < 5; i++){
	number[i] = ((Math.random()*26))
  	tile.letter[i] = String.fromCharCode(65+number[i])
  }
}