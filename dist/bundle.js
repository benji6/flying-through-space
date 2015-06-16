(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = canvas => {
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
}

},{}],2:[function(require,module,exports){
const autoResizeCanvas = require('./autoResizeCanvas.js')

module.exports = mainProgram => {
	const button = document.querySelector('button')
	const input = document.querySelector('input')
	const output = document.querySelector('output')
	const canvas = document.querySelector('canvas')

	canvas.onclick = () => {
		if (canvas.requestFullscreen) canvas.requestFullscreen()
		else if (canvas.mozRequestFullScreen) canvas.mozRequestFullScreen()
		else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen()
	}

	output.value = input.value
	input.oninput = () => output.value = input.value

	button.onclick = () => {
		canvas.className = 'fullscreen'
		autoResizeCanvas(canvas)
		window.intStars = input.value - 1
		window.starSize = 20 / Math.pow(window.intStars + 1, 0.4)
		document.querySelector('#introduction').className = 'hidden'
		document.querySelector('#instructions').className = 'instructions'
		mainProgram(window.intStars, window.starSize / 100, canvas)
	}

	button.onfocus = ({target}) => target.blur && target.blur()
}

},{"./autoResizeCanvas.js":1}],3:[function(require,module,exports){
module.exports = ({changeWarp, changeV}) => document.onkeydown = e => {
  switch (e.keyCode) {
    case 27: return location.reload()
    case 37:
    case 65: return changeWarp(-0.0005)
    case 39:
    case 68: return changeWarp(0.0005)
    case 38:
    case 87: return changeV(0.2)
    case 40:
    case 83: return changeV(-0.2)
  }
}

},{}],4:[function(require,module,exports){
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

},{"./domEvents.js":2,"./keyboardControls":3,"./shuffle.js":5}],5:[function(require,module,exports){
module.exports = arr => {
	let currentIdx = arr.length
	while (currentIdx) {
		const randomIdx = Math.floor(Math.random() * currentIdx--)
		const tempVal = arr[currentIdx]
		arr[currentIdx] = arr[randomIdx]
		arr[randomIdx] = tempVal
	}
	return arr
}

},{}]},{},[4]);
