document.addEventListener('DOMContentLoaded', () => {
	var grab = document.getElementById.bind(document);
	var goButton = grab('goButton');
	var clockPanel = grab('clockPanel');
	var veggies = ['eggplant.png'];
	document.body.style['background-color'] = 'black';

	//starts an animation of the timer picture
	//to complete in 'time' argument minutes
	function animatePic(duration, picAddr) {
		//make dt timer
		var duration = duration * 60 + 1;
		var seconds = 0;
		var timer = calcDt();
		window.requestAnimationFrame(animate);

		function animate() {
			//console.log('animating');
			seconds += timer();
			//make the clock readout
			var timeLeft = duration - seconds;
			var minutesLeft = Math.floor(timeLeft/60);
			var secondsLeft = Math.floor(timeLeft % 60);
			if (minutesLeft < 0) minutesLeft = 0;
			if (secondsLeft < 0) secondsLeft = 0;
			clockPanel.textContent = ('0' + minutesLeft).slice(-2) + ':' + ('0' + secondsLeft).slice(-2);

			//animate the picture
			drawPic(picAddr, seconds/duration * 100);

			//recurse while needed
			if (seconds < duration) window.requestAnimationFrame(animate);
		}
	}

  //function that takes the percentage of the picture that should
	//currently show and renders it
	function drawPic (picAddr, percent) {
		//first clear out the old entries, if they exist
		dump('mask');
		dump('pic');

		var frag = document.createDocumentFragment();
		var pic = frag.appendChild(document.createElement('img'));
		var mask = frag.appendChild(document.createElement('div'));

		pic.src = 'assets/' + picAddr;

		//scale smaller of w/h to 60% of screen w/h and keep aspect ratio
		var scale = (heightPercent(100) < widthPercent(100)) ? heightPercent(60) / pic.height :
				widthPercent(60) / pic.width;
		pic.id = 'pic';
		pic.width *= scale;
		pic.height *= scale;

		//position on screen
		pic.style.position = 'absolute';
		pic.style.top = ((heightPercent(100)-pic.height)/2).toString() + 'px';
		pic.style.left = ((widthPercent(100)-pic.width)/2).toString() + 'px';
		pic.style['z-index'] = '-50';

		//now drop a mask of the background color over the image
		//only leaving *percent* revealed
		mask.id = 'mask';
		mask.style['background-color'] = document.body.style['background-color'];
		mask.style.position = 'absolute';
		mask.style['min-width'] = pic.width + 'px';
		mask.style['min-height'] = (pic.height * (100 - percent) / 100) + 'px';
		mask.style.top = pic.style.top;
		mask.style.left = pic.style.left;
		mask.style['z-index'] = '50';

		//render to document
		document.body.appendChild(frag);
	}
	
	//function for deleting elements by id
	function dump(id) {
		var dumpee = document.getElementById(id);
		if  (dumpee) dumpee.parentNode.removeChild(dumpee);
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

	//test
	animatePic(1.25, 'watermelon.png');
});

