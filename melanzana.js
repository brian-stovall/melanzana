document.addEventListener('DOMContentLoaded', () => {
	var grab = document.getElementById.bind(document);
	var goButton = grab('goButton');
	var getDt = calcDt();
	var veggies = ['eggplant.png'];


	goButton.addEventListener('click', () => {
		alert(document.body.style['background-color']);

		drawPic(veggies[0],50);	
	});

  //function that takes the percentage of the picture that should
	//currently show and renders it
	function drawPic (picAddr, percent) {
		var frag = document.createDocumentFragment();
		var pic = frag.appendChild(document.createElement('img'));
		var mask = frag.appendChild(document.createElement('div'));

		pic.src = 'assets/' + picAddr;

		//scale height to 60% of screen and keep aspect ratio
		var scale = heightPercent(60) / pic.height ;
		console.log(pic.width + ', ' + pic.height);
		pic.width *= scale;
		pic.height *= scale;

		//position on screen
		pic.style.position = 'absolute';
		pic.style.top = heightPercent(15).toString() + 'px';
		pic.style.left = widthPercent(40).toString() + 'px';
		pic.style['z-index'] = '-50';

		//now drop a mask of the
		mask.style['background-color'] = 'black';// document.body.style['background-color'];
		mask.style.position = 'absolute';
		mask.style['min-width'] = pic.width + 'px';
		mask.style['min-height'] = (pic.height * percent / 100) + 'px';
		mask.style.top = pic.style.top;
		mask.style.left = pic.style.left;
		mask.style['z-index'] = '50';

		//render to document
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
