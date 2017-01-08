const domEvents = require('./domEvents.js')
const keyboardControls = require('./keyboardControls')
const shuffle = require('./shuffle.js')

const computeNewAngle = () => Math.random() * 2 * Math.PI

const mainProgram = (intStars, starSize, canvas) => {
	const context = canvas.getContext('2d')
	const starModels = []

	let colorCycle = 0
	let warp = 0
	let v = 1

	const colors = shuffle([
		colorVal => colorVal.toFixed(0),
		colorVal => (255 - colorVal).toFixed(0),
		(colorVal, colorCycle) => (255 * Math.sin(colorCycle)).toFixed(0),
	])

	// initialize model
	for (let i = 0; i <= intStars; i++) {
		const phi = computeNewAngle()
		const randomFactor = Math.pow(Math.random(), 2)
		starModels[i] = {
			angle: computeNewAngle(),
			x: randomFactor * canvas.width / 2 * Math.cos(phi),
			y: randomFactor * canvas.height / 2 * Math.sin(phi),
		}
	}

	(function animationLoop () {
		window.requestAnimationFrame(animationLoop)
		context.fillStyle = 'rgba(0, 0, 0, .05)'
		context.fillRect(0, 0, canvas.width, canvas.height)
		colorCycle += 0.01

		starModels.forEach(starModel => {
			const {x, y, angle} = starModel
			if (Math.abs(x) >= canvas.width / 2 || Math.abs(y) >= canvas.height / 2) {
				const newAngle = computeNewAngle()
				starModel.x = Math.cos(newAngle) * v * 0.01
				starModel.y = Math.sin(newAngle) * v * 0.01
				starModel.angle = newAngle
				return
			}
			const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
			const velMod = v * (r + 1) / 100
			starModel.x = x + Math.cos(angle + warp * r) * velMod
			starModel.y = y + Math.sin(angle - warp * r) * velMod
			const starSizeMod = r / 100 * starSize
			const colorVal = r / (Math.sqrt(Math.pow(canvas.width / 2, 2) +
				Math.pow(canvas.height / 2, 2))) * 255
			context.fillStyle = `rgb(${colors[0](colorVal, colorCycle)}, ${colors[1](colorVal, colorCycle)}, ${colors[2](colorVal, colorCycle)})`
			context.fillRect(canvas.width / 2 + x, canvas.height / 2 + y,
				starSizeMod, starSizeMod)
		})
	}())

	keyboardControls({
		changeV: x => v += x,
		changeWarp: x => warp += x,
	})
}

domEvents(mainProgram)
