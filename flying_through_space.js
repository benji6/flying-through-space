var flying_through_space = (function () {

var booBreak = false;
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
	var addH2 = addViewToTxt('h2');
	var addP = addViewToTxt('p');

	//set properties of elements
	inputRange.className = 'slider';
	inputRange.type = 'range';
	inputRange.min = '64';
	inputRange.max = '2048';
	inputRange.step = '8';
	inputRange.value = '512';
	inputRange.onchange = function() {
		rangeValue.value = this.value;
	};
	rangeValue.value = '512';

	//append to viewHolder
	addH2('Flying Through Space');
	addH2('Select Number of Stars');
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
function mainProgram(intStars,starSize){
	booBreak = false;
	//change display
	txtView.style.display = 'none';

	instructionsView.className = 'instructions';
	canvas.className = 'fullscreen';
	context = canvas.getContext('2d');
	viewHolder.appendChild(canvas);
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas, false);
	function resizeCanvas(){
		canvas.width=window.innerWidth;
		canvas.height=window.innerHeight;
	}
	var warp = 0;
	master(intStars);
	function master(intStars){
		v=1.4;
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
			if (booBreak==true){
				return;
			}
			window.requestAnimFrame(function(){
				motionLooper(intStars,starSize);
			});
			context.clearRect(0,0,canvas.width,canvas.height);
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
			return "rgb("+parseInt(colorVal,10)+","+parseInt(255-colorVal,10)+","+parseInt(255*Math.sin(colorCycle),10)+")";
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
	}
}

var on = function () {
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
