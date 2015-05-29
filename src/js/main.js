const autoResizeCanvas = require('./autoResizeCanvas.js');
const createTextView = require('./createTextView.js');
const keyboardControls = require('./keyboardControls');

const canvas = document.createElement('canvas');
const viewHolder = createTextView(mainProgram);

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
	autoResizeCanvas(canvas);
	var colorCycle = 0;

	const colors = shuffle([
		(colorVal) => colorVal.toFixed(0),
		(colorVal) => (255 - colorVal).toFixed(0),
		(colorVal, colorCycle) => (255 * Math.sin(colorCycle)).toFixed(0),
	]);

	canvas.className = 'fullscreen';
	var context = canvas.getContext('2d');
	viewHolder.appendChild(canvas);

	var warp = 0;
	var v = 1;
	const arrA = [];
	const arrX = [];
	const arrY = [];

	for(var i = 0; i <= intStars; i++){
		arrX[i]=(Math.random()-.5)*(Math.random()-.5)*(Math.random()-.5)*(Math.random()-.5)*16*(canvas.width);
		arrY[i]=(Math.random()-.5)*(Math.random()-.5)*(Math.random()-.5)*(Math.random()-.5)*16*(canvas.height);
		arrA[i]=(Math.sin(arrX[i])+Math.cos(arrY[i]))*2*Math.PI;
	}

	motionLooper(intStars,starSize);

	function motionLooper (intStars,starSize) {
		window.requestAnimationFrame(() => motionLooper(intStars,starSize));
		context.fillStyle = "rgba(0, 0, 0, .05)";
		context.fillRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i <= intStars; i++) {
			if (Math.abs(arrX[i])>=canvas.width/2 || Math.abs(arrY[i])>=canvas.height/2) {
				arrX[i]=0;
				arrY[i]=0;
				arrA[i]=Math.random()*2*Math.PI;
			}
			var dist = Math.sqrt(Math.pow(arrX[i], 2) + Math.pow(arrY[i], 2));
			var velMod=v * (dist + 1) / 100;
			arrX[i] = arrX[i] + Math.sin(arrA[i] + warp * dist) * velMod;
			arrY[i] = arrY[i] + Math.cos(arrA[i] - warp * dist) * velMod;
			var starSizeMod = dist / 100 * starSize;
			var colorVal = dist / (Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2))) * 255;
			context.fillStyle=`rgb(${colors[0](colorVal, colorCycle)}, ${colors[1](colorVal, colorCycle)}, ${colors[2](colorVal, colorCycle)})`;
			context.fillRect(canvas.width/2+arrX[i],canvas.height/2+arrY[i],starSizeMod,starSizeMod);
		}
		colorCycle += 0.01;
	}

	keyboardControls({
		changeWarp: (x) => warp += x,
		changeV: (x) => v += x,
	});
}
