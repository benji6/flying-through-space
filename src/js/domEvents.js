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
		mainProgram(window.intStars, window.starSize, canvas)
	}

	button.onfocus = ({target}) => target.blur && target.blur()
}
