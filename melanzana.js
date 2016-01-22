document.addEventListener('DOMContentLoaded', () => {
	var grab = document.getElementById.bind(document);
	var goButton = grab('goButton');
	var getDt = calcDt();
	var veggies = ['eggplant.png'];

	goButton.addEventListener('click', () => {
		drawPic(veggies[0]);	
	});

  //function that takes the percentage of the picture that should
	//currently show and renders it
	function drawPic (picAddr, percent) {
		var frag = document.createDocumentFragment();
		var pic = frag.appendChild(document.createElement('img'));
		pic.src = 'assets/' + picAddr;
		var scale = heightPercent(60) / pic.height ;
		console.log(pic.width + ', ' + pic.height);
		pic.style.position = 'absolute';
		pic.width *= scale;
		pic.height *= scale;
		pic.style.top = heightPercent(15).toString() + 'px';
		pic.style.left = widthPercent(40).toString() + 'px';
		document.body.appendChild(frag);
	}

	//simple helper making percentage-based calculations
	function pctToPx (dimension, percent) {
		return dimension * percent / 100;
	}

	//easy handles from percent screen width/height ->  px
	var widthPercent = pctToPx.bind(null, document.body.offsetWidth);
	var heightPercent = pctToPx.bind(null, document.body.offsetHeight);

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
});
