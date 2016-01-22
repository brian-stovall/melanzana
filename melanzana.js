document.addEventListener('DOMContentLoaded', () => {
	var getDt = calcDt();

});

//returns a function that gives the time
//in seconds since it was last run
function calcDt() {
	var lastTime = Date.now();
	return () => {
		result = (Date.now() - lastTime) / 1000;
		lastTime = Date.now();
		return result;
	}
}
