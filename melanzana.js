document.addEventListener('DOMContentLoaded', () => {
	var grab = document.getElementById.bind(document);
	var goButton = grab('goButton');
	var clockPanel = grab('clockPanel');
	var topWords = grab('topWords');
	document.body.style['background-color'] = 'black';
	var workDuration = .2;
	var restDuration = .1;

	//starts an animation of the timer picture
	//to complete in 'time' argument minutes
	//take a style variable that can be 'work' or 'rest' for the two different display styles
	function animatePic(picAddr, style) {
		//make dt timer
		var duration = (style === 'work') ? workDuration : restDuration;
		duration = duration * 60;
		var seconds = 0;
		var timer = calcDt();

		//change the text at the top of the screen
		topWords.textContent = (style === 'work') ? 'Work' : 'Relax';

		//style everything appropriately
		topWords.style.color = (style === 'work') ? 'black' : 'black';
		document.body.style['background-color'] = (style === 'work') ? '#488' : '#844';

		//draw the initial image and get a reference to the mask
		var mask = drawPic(picAddr);

		window.requestAnimationFrame(animate);
		
		//tracks timing, changes the mask height, and renders the timer
		function animate() {
			seconds += timer();
			//make the clock readout
			var timeLeft = duration - seconds;
			var minutesLeft = Math.floor(timeLeft/60);
			var secondsLeft = Math.ceil(timeLeft % 60);
			if (minutesLeft < 0) minutesLeft = 0;
			if (secondsLeft < 0) secondsLeft = 0;
			clockPanel.textContent = ('0' + minutesLeft).slice(-2) + ':' + ('0' + secondsLeft).slice(-2);

			//change the mask height
			mask.style['min-height'] = (style === 'work') ? 
				mask.maxHeight - (seconds/duration * mask.maxHeight) + 'px' :
				(seconds/duration * mask.maxHeight) + 'px'; 

			//recurse while needed
			if (seconds < duration) window.requestAnimationFrame(animate);
			else {
				var newStyle = (style === 'work') ? 'rest' : 'work'; 
				animatePic(picAddr, newStyle);
			}
		}
	}

	//function that draws the picture and a div mask completely obscuring it,
	//then returns the mask's element
	function drawPic (picAddr) {
		dump('pic');
		dump('mask');
		var pic = document.body.appendChild(document.createElement('img'));
		var mask = document.body.appendChild(document.createElement('div'));
		mask.id = 'mask';
		pic.id = 'pic';
		pic.src = 'assets/' + picAddr;

		//choose the smaller screen dimension and scale the matching
		//pic dimension to 60%, then scale the other dimension accordingly to keep a/r
		var scale = (heightPercent(100) < widthPercent(100)) ?
			heightPercent(60) / pic.height :
			widthPercent(60) / pic.width;
		if (scale > 1) scale = 1/scale;
		//hmm... changing one dimension automatically changes both to preserve a/r?
		pic.width *= scale;

		//position on screen
		pic.style.position = 'absolute';
		pic.style.top = ((heightPercent(100)-pic.height)/2).toString() + 'px';
		pic.style.left = ((widthPercent(100)-pic.width)/2).toString() + 'px';
		pic.style['z-index'] = '-50';

		//now drop a mask of the background color over the image
		mask.style['background-color'] = document.body.style['background-color'];
		mask.style.position = 'absolute';
		mask.style['min-width'] = pic.width + 'px';
		mask.style['min-height'] = pic.height + 'px';
		mask.style.top = pic.style.top;
		mask.style.left = pic.style.left;
		mask.style['z-index'] = '50';
		//this is a reference to the final height of the full mask
		mask.maxHeight = pic.height;

		//return the mask element
		return mask;
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
	animatePic('eggplant.png', 'relax');
});

