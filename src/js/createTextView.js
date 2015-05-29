const R = require('ramda');

module.exports = (mainProgram) => {
	var txtView = document.createElement('div');
	var inputRange = document.createElement('input');
	var rangeValue = document.createElement('output');
	var viewHolder = document.createElement('div');
	var btnLaunch = document.createElement('button');
	var instructionsView = document.createElement('div');

	appendView = () => document.body.appendChild(viewHolder);

	getSlider = () => {
		window.intStars = inputRange.value - 1;
		window.starSize = 20 / Math.pow(intStars + 1, 0.4);
		mainProgram(intStars, starSize);
		txtView.className = 'hidden';
		btnLaunch.className = "hidden";
		instructionsView.className = 'instructions';
	};

	var addView = (parentEl, childEl, txtNode) => {
		var childElement = document.createElement(childEl);
		childElement.appendChild(document.createTextNode(txtNode));
		parentEl.appendChild(childElement);
	};
	var curryAddView = R.curry(addView);
	var addViewToTxt = curryAddView(txtView);
	var addH1 = addViewToTxt('h1');
	var addH3 = addViewToTxt('h3');
	var addP = addViewToTxt('p');

	//set properties of elements
	inputRange.className = 'slider';
	inputRange.type = 'range';
	inputRange.min = '64';
	inputRange.max = '3072';
	inputRange.step = '8';
	inputRange.value = inputRange.max;
	inputRange.onchange = function () {
		rangeValue.value = this.value;
	};
	rangeValue.value = inputRange.value;

	//append to viewHolder
	addH1('Flying Through Space');
	addH3('Select Number of Stars');
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

	appendView();

	return viewHolder;
};
