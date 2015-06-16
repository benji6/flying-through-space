const autoResizeCanvas = require('./autoResizeCanvas.js');

module.exports = (mainProgram) => {
	const button = document.querySelector("button");
	const input = document.querySelector("input");
	const instructions = document.querySelector("#instructions");
	const output = document.querySelector("output");
	const viewHolder = document.body.appendChild(document.createElement("div"));
	const canvas = document.querySelector('canvas');

	canvas.onclick = () => {
	  if (canvas.requestFullscreen) {
	    canvas.requestFullscreen();
	  } else if (canvas.mozRequestFullScreen) {
	    canvas.mozRequestFullScreen();
	  } else if (canvas.webkitRequestFullscreen) {
	    canvas.webkitRequestFullscreen();
	  }
	};

	output.value = input.value;
	input.oninput = () => output.value = input.value;

	button.onclick = () => {
		canvas.className = "fullscreen";
		autoResizeCanvas(canvas);
		window.intStars = input.value - 1;
		window.starSize = 20 / Math.pow(intStars + 1, 0.4);
		document.querySelector("#introduction").className = "hidden";
		document.querySelector("#instructions").className = "instructions";
		mainProgram(intStars, starSize, canvas);
	};

	button.onfocus = ({target}) => target.blur && target.blur();
};
