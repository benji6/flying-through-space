var flying_through_space = (function () {

var booBreak = false;
var intStars, starSize, arrA, arrX, arrY, colorCycle;
var viewHolder = document.createElement('div');
var txtView = document.createElement('div');
var instructionsView = document.createElement('div');
var inputRange = document.createElement('input');
var rangeValue = document.createElement('output');
var btnLaunch = document.createElement('button');
var canvas = document.createElement('canvas');

(function createTxtView() {
	var curry = function(func) {
		var curried = function(args) {
			if (args.length >= func.length) {
				return func.apply(null, args);
			}
			return function() {
				return curried(args.concat(Array.prototype.slice.apply(arguments)));
			};
		};
		return curried(Array.prototype.slice.apply(arguments, [1]));
	};
	var addView = function(parentEl, childEl, txtNode) {
		var childElement = document.createElement(childEl);
		childElement.appendChild(document.createTextNode(txtNode));
		parentEl.appendChild(childElement);
	};
	var curryAddView = curry(addView);
	var addViewToTxt = curryAddView(txtView);
	var addH1 = addViewToTxt('h1');
	var addH3 = addViewToTxt('h3');
	var addP = addViewToTxt('p');

	//set properties of elements
	inputRange.className = 'slider';
	inputRange.type = 'range';
	inputRange.min = '64';
	inputRange.max = '3072';
	inputRange.step = '8';
	inputRange.value = inputRange.max;
	inputRange.onchange = function() {
		rangeValue.value = this.value;
	};
	rangeValue.value = inputRange.value;

	//append to viewHolder
	addH1('Flying Through Space');
	addH3('Select Number of Stars');
	addP('More Stars = More Resource Intensive');
	addP('Instructions: use up and down arrow keys to control speed and left and right to warp spacetime');
	addP('Fullscreen recommended!');
	txtView.appendChild(inputRange);
	txtView.appendChild(rangeValue);
	viewHolder.appendChild(txtView);

	btnLaunch.onclick = getSlider;
	btnLaunch.onfocus = function () {
		this.blur && this.blur();
	};
	btnLaunch.appendChild(document.createTextNode('Launch!'));
	viewHolder.appendChild(btnLaunch);
	instructionsView.className = 'hidden';
	instructionsView.appendChild(document.createTextNode('Use up and down arrow keys to control speed and left and right to warp spacetime'));
	viewHolder.appendChild(instructionsView);
}());
function appendView() {
	document.body.appendChild(viewHolder);
}

//requestAnimFrame
window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback){
		window.setTimeout(callback, 1000 / 60);
	};
})();
function getSlider() {
	intStars = inputRange.value - 1;
	starSize = 20 / Math.pow((intStars + 1), .4);
	mainProgram(intStars, starSize);
}
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
	txtView.className = 'hidden';
	btnLaunch.className = "hidden";

	instructionsView.className = 'instructions';
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
			window.requestAnimFrame(function(){
				motionLooper(intStars,starSize);
			});
			context.fillStyle = 'rgba(0, 0, 0, .05)';
			context.fillRect(0, 0, canvas.width, canvas.height);
			for(var i = 0;i <= intStars; i++){
				motion(i,starSize);
			}
			colorCycle=colorCycle+.01;
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
			return 'rgb(' + getColor.r(colorVal, colorCycle) +
				','  + getColor.g(colorVal, colorCycle) +
				',' + getColor.b(colorVal, colorCycle) +
			')';
		}
	}
	//controls
	document.onkeydown = function(e) {
		//left
		if (e.keyCode==37 || e.keyCode==65) {
			warp-=.0005;
			return;
		}
		//right
		if (e.keyCode==39 || e.keyCode==68) {
			warp+=.0005;
			return;
		}
		//up
		if (e.keyCode==38 || e.keyCode==87) {
			v=v+.2;
			return;
		}
		//down
		if (e.keyCode==40 || e.keyCode==83) {
			v=v-.2;
			return;
		}
	};
}

var on = function () {
	shuffle(colors);
	appendView();
};
var off = function () {
	booBreak = true;
	canvas.parentNode && canvas.parentNode.removeChild(canvas);
	viewHolder.parentNode && viewHolder.parentNode.removeChild(viewHolder);
	instructionsView.className = 'hidden';
	txtView.style.display = '';
	canvas.className = '';


};
return {
	on: on,
	off: off
};
}());

flying_through_space.on();
