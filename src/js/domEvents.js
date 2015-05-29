module.exports = (mainProgram) => {
	const button = document.querySelector("button");
	const input = document.querySelector("input");
	const instructions = document.querySelector("#instructions");
	const output = document.querySelector("output");
	const viewHolder = document.body.appendChild(document.createElement("div"));

	output.value = input.value;
	input.oninput = () => output.value = input.value;

	button.onclick = () => {
		window.intStars = input.value - 1;
		window.starSize = 20 / Math.pow(intStars + 1, 0.4);
		document.querySelector("#introduction").className = "hidden";
		mainProgram(intStars, starSize);
	};

	button.onfocus = ({target}) => target.blur && target.blur();

	return viewHolder;
};
