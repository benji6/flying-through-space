const domEvents = require('./domEvents.js');
const keyboardControls = require('./keyboardControls');
const shuffle = require('./shuffle.js');

const mainProgram = (intStars, starSize, canvas) => {
	const context = canvas.getContext('2d');
	const starAngles = [];
	const starXCoords = [];
	const starYCoords = [];
	var colorCycle = 0;
	var warp = 0;
	var v = 1;

	const colors = shuffle([
		(colorVal) => colorVal.toFixed(0),
		(colorVal) => (255 - colorVal).toFixed(0),
		(colorVal, colorCycle) => (255 * Math.sin(colorCycle)).toFixed(0),
	]);

	//initialize model
	for (var i = 0; i <= intStars; i++) {
		starXCoords[i]= Math.pow(Math.random(), 4) * (Math.round(Math.random()) ? 1 : -1) /
			2 * canvas.width;
			starYCoords[i]= Math.pow(Math.random(), 4) * (Math.round(Math.random()) ? 1 : -1) /
			2 * canvas.height;
		starAngles[i]= (Math.sin(starXCoords[i]) + Math.cos(starYCoords[i])) * 2 * Math.PI;
	}

	(function animationLoop () {
		window.requestAnimationFrame(animationLoop);
		context.fillStyle = "rgba(0, 0, 0, .05)";
		context.fillRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i <= intStars; i++) {
			if (Math.abs(starXCoords[i]) >= canvas.width / 2 ||
				Math.abs(starYCoords[i]) >= canvas.height / 2) {
				starXCoords[i] = 0;
				starYCoords[i] = 0;
				starAngles[i] = Math.random() * 2 * Math.PI;
			}
			const dist = Math.sqrt(Math.pow(starXCoords[i], 2) + Math.pow(starYCoords[i], 2));
			const velMod = v * (dist + 1) / 100;
			starXCoords[i] = starXCoords[i] + Math.sin(starAngles[i] + warp * dist) * velMod;
			starYCoords[i] = starYCoords[i] + Math.cos(starAngles[i] - warp * dist) * velMod;
			const starSizeMod = dist / 100 * starSize;
			const colorVal = dist / (Math.sqrt(Math.pow(canvas.width / 2, 2) +
				Math.pow(canvas.height / 2, 2))) * 255;
			context.fillStyle=`rgb(${colors[0](colorVal, colorCycle)}, ${colors[1](colorVal, colorCycle)}, ${colors[2](colorVal, colorCycle)})`;
			context.fillRect(canvas.width / 2 + starXCoords[i], canvas.height / 2 + starYCoords[i],
				starSizeMod, starSizeMod);
		}
		colorCycle += 0.01;
	}());

	keyboardControls({
		changeWarp: (x) => warp += x,
		changeV: (x) => v += x,
	});
};

domEvents(mainProgram);
