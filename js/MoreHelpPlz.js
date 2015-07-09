var ongoingTouches = new Array();

var boxX = 50
var boxY = 50
var sizeX = 50
var sizeY = 50
var distX
var distY

draw()

var box1 = document.getElementById('box2'), boxleft, startx, dist = 0, touchobj = null

function handleStart(evt) {
  evt.preventDefault();
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;
  console.log(touches[0].pageX + " " + boxX);
  if (touches[0].pageX >= boxX)
  {
  console.log("1");
	if (touches[0].pageX <= boxX + 50)
	{
  console.log("2");
		distX = touches[0].pageX-boxX
	}
  }
  console.log(touches[0].pageY + " " + boxY);
  if (touches[0].pageY >= boxY)
  {
  console.log("3");
	if (touches[0].pageY <= boxY + 50)
	{
  console.log("4");
		distY = touches[0].pageY-boxY
	}
  }  
}

function handleMove(evt) {
  evt.preventDefault();
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;
  console.log("HandleMovedUp");
  if (touches[0].pageX >= boxX)
  {
	if (touches[0].pageX <= boxX + 50)
	{
		if (touches[0].pageY >= boxY)
		{
			if (touches[0].pageY <= boxY + 50)
			{
				boxX = touches[0].pageX - distX
				boxY = touches[0].pageY - distY
				draw()
			}
		}
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
    boxX = boxX+10;
    boxY = boxY+40;
    ctx.fillText("A",boxX,boxY);
    boxX = boxX-10;
    boxY = boxY-40; 
 }
}
