var flying_through_space = (function () {

var instructionsView = document.createElement('div');
var viewHolder = document.createElement('div');
var txtView = document.createElement('div');
var inputRange = document.createElement('input');
(function createTxtView() {
var h2 = document.createElement('h2');
var h2b = document.createElement('h2');
var p1 = document.createElement('p');
var p2 = document.createElement('p');
var p3 = document.createElement('p');
rangeValue = document.createElement('output');

h2.appendChild(document.createTextNode('Flying Through Space'));
h2b.appendChild(document.createTextNode('Select Number of Stars'));
p1.appendChild(document.createTextNode('More Stars = More Resource Intensive'));
p2.appendChild(document.createTextNode('Instructions: use up and down arrow keys to control speed and left and right to warp spacetime'));
p3.appendChild(document.createTextNode('Fullscreen recommended!'));
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

txtView.appendChild(h2);
txtView.appendChild(h2b);
txtView.appendChild(p1);
txtView.appendChild(p2);
txtView.appendChild(p3);
txtView.appendChild(inputRange);
txtView.appendChild(rangeValue);
viewHolder.appendChild(txtView);


}());

var btnLaunch = document.createElement('button');
document.body.appendChild(viewHolder);
//declare and initialize variables
booBreak=false;
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
	booBreak=false;
	//change display
	txtView.style.display='none';
	instructionsView.appendChild(document.createTextNode('Use up and down arrow keys to control speed and left and right to warp spacetime'));
	instructionsView.className='instructions';
	document.body.style.cursor='none';
	//create canvas
	canvas = document.createElement('canvas');
	canvas.className = 'fullscreen';
	context=canvas.getContext('2d');
	viewHolder.appendChild(canvas);
	resizeCanvas();
	window.addEventListener('resize',resizeCanvas,false);
	function resizeCanvas(){
		canvas.width=window.innerWidth;
		canvas.height=window.innerHeight;
	}
	warp=0;
	master(intStars);
	function master(intStars){
		v=1.4;
		arrA=[];
		arrX=[];
		arrY=[];
		for(i=0;i<=intStars;i++){
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
			for(i=0;i<=intStars;i++){
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
		//escape to return to showcase
		if (e.keyCode == 27) {
			window.history.back();
			return;
		}
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

btnLaunch.onclick = getSlider;
btnLaunch.onfocus = function () {
	this.blur && this.blur();
};
btnLaunch.appendChild(document.createTextNode('Launch!'));
viewHolder.appendChild(btnLaunch);

var on = function () {
	console.log('on');
};
var off = function () {
	document.body.style.cursor='default';
	booBreak = true;
	viewHolder.parentNode && viewHolder.parentNode.removeChild(viewHolder);
};
return {
	on: on,
	off: off
};
}());
