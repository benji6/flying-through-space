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
