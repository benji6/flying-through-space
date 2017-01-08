const domEvents = require('./domEvents.js')
const keyboardControls = require('./keyboardControls')
const shuffle = require('./shuffle.js')

const starModels = []
const TAU = 2 * Math.PI

const mainProgram = (intStars, starSize, canvas) => {
	const context = canvas.getContext('2d')
  const {height, width} = canvas

  const colors = shuffle([
    colorVal => colorVal.toFixed(0),
    colorVal => (255 - colorVal).toFixed(0),
    (colorVal, colorCycle) => (255 * Math.sin(colorCycle)).toFixed(0),
  ])

	let colorCycle = 0
	let warp = 0
	let v = 0.01

	for (let i = 0; i <= intStars; i++) {
		const phi = Math.random() * TAU
		const randomFactor = Math.pow(Math.random(), 2)
		starModels[i] = {
			angle: Math.random() * TAU,
			x: randomFactor * width / 2 * Math.cos(phi),
			y: randomFactor * height / 2 * Math.sin(phi),
		}
	}

	(function animationLoop () {
		requestAnimationFrame(animationLoop)
    const {height, width} = canvas
    const widthHalf = width / 2
    const heightHalf = height / 2
    const colorValModifier = 1 / Math.hypot(widthHalf, heightHalf) * 255

		context.fillStyle = 'rgba(0,0,0,.05)'
		context.fillRect(0, 0, width, height)
		colorCycle += 0.01

    for (let i = 0; i < starModels.length; i++) {
      const starModel = starModels[i]
      const {x, y, angle} = starModel
      if (Math.abs(x) >= widthHalf || Math.abs(y) >= heightHalf) {
        const newAngle = Math.random() * TAU
        starModel.x = Math.cos(newAngle) * v
        starModel.y = Math.sin(newAngle) * v
        starModel.angle = newAngle
        continue
      }
      const r = Math.hypot(x, y)
      const velMod = v * (r + 1)
      starModel.x = x + Math.cos(angle + warp * r) * velMod
      starModel.y = y + Math.sin(angle - warp * r) * velMod
      const starSizeMod = r * starSize
      const colorVal = r * colorValModifier
      context.fillStyle = `rgb(${colors[0](colorVal, colorCycle)},${colors[1](colorVal, colorCycle)},${colors[2](colorVal, colorCycle)})`
      context.fillRect(widthHalf + x, heightHalf + y, starSizeMod, starSizeMod)
    }
	}())

	keyboardControls({
		changeV: x => v += x / 100,
		changeWarp: x => warp += x,
	})
}

domEvents(mainProgram)
