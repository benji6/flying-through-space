module.exports = (arr) => {
	var currentIdx = arr.length;
	while (currentIdx) {
		let randomIdx = Math.floor(Math.random() * currentIdx--);
		let tempVal = arr[currentIdx];
		arr[currentIdx] = arr[randomIdx];
		arr[randomIdx] = tempVal;
	}
	return arr;
};
