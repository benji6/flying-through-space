require('./keyboardControls.js');
var createTextView = require('./createTextView.js');

var booBreak = false;
var intStars, starSize, arrA, arrX, arrY, colorCycle;

var canvas = document.createElement('canvas');



var viewHolder = createTextView(mainProgram);


//mainProgram;
var colors = [];
//Fisher-Yates algorithm
var shuffle = function(arr) {
	var currentIdx = arr.length;
	var tempVal;
	var randomIdx;
	while (currentIdx) {
		randomIdx = Math.floor(Math.random() * currentIdx);
		currentIdx--;
		tempVal = arr[currentIdx];
		arr[currentIdx] = arr[randomIdx];
		arr[randomIdx] = tempVal;
	}
	return arr;
};
function mainProgram(intStars,starSize){
	colors[0] = function r(colorVal) {
		return colorVal.toFixed(0);
	};
	colors[1] = function g(colorVal) {
		return (255 - colorVal).toFixed(0);
	};
	colors[2] = function b(colorVal, colorCycle) {
		return (255 * Math.sin(colorCycle)).toFixed(0);
	};
	shuffle(colors);
	var getColor = {
		r: colors[0],
		g: colors[1],
		b: colors[2]
	};
	booBreak = false;
	//change display



	canvas.className = 'fullscreen';
	var context = canvas.getContext('2d');
	viewHolder.appendChild(canvas);
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas, false);
	function resizeCanvas(){
		canvas.width=window.innerWidth;
		canvas.height=window.innerHeight;
	}
	var warp = 0;
	master(intStars);
	var v;
	function master(intStars) {
		v = 1;
		arrA=[];
		arrX=[];
		arrY=[];
		for(var i = 0; i <= intStars; i++){
			arrX[i]=(Math.random()-.5)*(Math.random()-.5)*(Math.random()-.5)*(Math.random()-.5)*16*(canvas.width);
			arrY[i]=(Math.random()-.5)*(Math.random()-.5)*(Math.random()-.5)*(Math.random()-.5)*16*(canvas.height);
			arrA[i]=(Math.sin(arrX[i])+Math.cos(arrY[i]))*2*Math.PI;
		}
		colorCycle=0;
		motionLooper(intStars,starSize);
		function motionLooper(intStars,starSize) {
			if (booBreak === true) {
				return;
			}
			window.requestAnimationFrame(function(){
				motionLooper(intStars,starSize);
			});
			context.fillStyle = 'rgba(0, 0, 0, .05)';
			context.fillRect(0, 0, canvas.width, canvas.height);
			for(var i = 0;i <= intStars; i++){
				motion(i,starSize);
			}
			colorCycle += 0.01;
		}
		function motion(i,starSize) {
			if (Math.abs(arrX[i])>=canvas.width/2 || Math.abs(arrY[i])>=canvas.height/2) {
				newStar(i);
			}
			var dist=Math.sqrt(Math.pow(arrX[i],2)+Math.pow(arrY[i],2));
			var velMod=v*(dist+1)/100;
			arrX[i]=arrX[i]+Math.sin(arrA[i]+warp*dist)*velMod;
			arrY[i]=arrY[i]+Math.cos(arrA[i]-warp*dist)*velMod;
			var starSizeMod=dist/100*starSize;
			context.fillStyle=starColor(i,dist);
			context.fillRect(canvas.width/2+arrX[i],canvas.height/2+arrY[i],starSizeMod,starSizeMod);
		}
		function newStar(i) {
			arrX[i]=0;
			arrY[i]=0;
			arrA[i]=Math.random()*2*Math.PI;
		}
		function starColor(i,dist) {
			var colorVal=dist/(Math.sqrt(Math.pow(canvas.width/2,2)+Math.pow(canvas.height/2,2)))*255;
			return `rgb(${getColor.r(colorVal, colorCycle)}, ${getColor.g(colorVal, colorCycle)}, ${getColor.b(colorVal, colorCycle)})`;
		}
	}

	const changeWarp = (x) => warp += x;
	const changeV = (x) => v += x;

	//controls
	document.onkeydown = function(e) {
		//left
		if (e.keyCode==37 || e.keyCode==65) {
			changeWarp(-0.0005);
			return;
		}
		//right
		if (e.keyCode==39 || e.keyCode==68) {
			changeWarp(0.0005);
			return;
		}
		//up
		if (e.keyCode==38 || e.keyCode==87) {
			changeV(0.2);
			return;
		}
		//down
		if (e.keyCode==40 || e.keyCode==83) {
			changeV(-0.2);
			return;
		}
	};
}

shuffle(colors);
