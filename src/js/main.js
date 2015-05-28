require('./keyboardControls.js');
var createTextView = require('./createTextView.js');

var intStars, starSize, arrA, arrX, arrY, colorCycle;
var canvas = document.createElement('canvas');
var viewHolder = createTextView(mainProgram);

//Fisher-Yates algorithm
const shuffle = (arr) => {
	var currentIdx = arr.length;
	while (currentIdx) {
		var randomIdx = Math.floor(Math.random() * currentIdx--);
		var tempVal = arr[currentIdx];
		arr[currentIdx] = arr[randomIdx];
		arr[randomIdx] = tempVal;
	}
	return arr;
};

function mainProgram (intStars, starSize) {
	const colors = shuffle([
		(colorVal) => colorVal.toFixed(0),
		(colorVal) => (255 - colorVal).toFixed(0),
		(colorVal, colorCycle) => (255 * Math.sin(colorCycle)).toFixed(0),
	]);

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
			window.requestAnimationFrame(() => motionLooper(intStars,starSize));
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
			var colorVal = dist / (Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2))) * 255;
			return `rgb(${colors[0](colorVal, colorCycle)}, ${colors[1](colorVal, colorCycle)}, ${colors[2](colorVal, colorCycle)})`;
		}
	}

	const changeWarp = (x) => warp += x;
	const changeV = (x) => v += x;

	//controls
	document.onkeydown = (e) => {
		switch (e.keyCode) {
			case 37:
			case 65:
				//left
				return changeWarp(-0.0005);
			case 39:
			case 68:
				//right
				return changeWarp(0.0005);
			case 38:
			case 87:
				//up
				return changeV(0.2);
			case 40:
			case 83:
				//right
				return changeV(-0.2);
		}
	};
}
