document.addEventListener('DOMContentLoaded', () => {
	//sloth
	var grab = document.getElementById.bind(document);

	//getting element references
	var beginButton = grab('begin');
	var clockPanel = grab('clockPanel');
	var topWords = grab('topWords');
	var workDur = grab('workDur');
	var restDur = grab('restDur');
	var workPlus = grab('workPlus');
	var workMinus = grab('workMinus');
	var restPlus = grab('restPlus');
	var restMinus = grab('restMinus');

	//a handy list of controls that can go away when the animation starts
	var controls = document.getElementsByClassName('control');
	
	//'globals' that hold work and rest duration
	var workDuration = parseInt(workDur.textContent);
	var restDuration = parseInt(restDur.textContent);

	var animRunning = false;

	menu();



	beginButton.onclick = () => { 
		for (var i = 0; i < controls.length; i++)
			controls[i].style.visibility = 'hidden';
		animatePic('eggplant.png', 'work'); 
	};

	workMinus.onclick = () => {
		if (workDuration > 1)
			workDuration -= 1;
		workDur.textContent = workDuration;
	};

	workPlus.onclick = () => {
		workDuration += 1;
		workDur.textContent = workDuration;
	};

	restMinus.onclick = () => {
		if (restDuration > 1)
			restDuration -= 1;
		restDur.textContent = restDuration;
	};

	restPlus.onclick = () => {
		restDuration += 1;
		restDur.textContent = restDuration;
	};

	//return the window to the menu state
  function menu() {
		//state variable - is the animation running?
		animRunning=false;

		//make topWords say something nice
		topWords.textContent = 'Melanzana Timer';
		topWords.style.color = 'white';
		clockPanel.style.color = 'black';

		document.body.style['background-color'] = 'black';
	}
	
	//starts an animation of the timer picture
	//to complete in 'time' argument minutes
	//take a style variable that can be 'work' or 'rest' for the two different display styles
	function animatePic(picAddr, style) {

		animRunning = true;
		

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

			//if the user clicks the window while the timer is running,
			//they will be prompted to stop the animation and return to menu
			document.onclick = () => {
				if (animRunning)
					if (confirm('Stop the timer?')) {
						menu(); 
					}
			}

			seconds += timer();
			//make the clock readout
			var timeLeft = duration - seconds;
			var minutesLeft = Math.floor(timeLeft/60);
			var secondsLeft = Math.floor(timeLeft % 60);
			if (minutesLeft < 0) minutesLeft = 0;
			if (secondsLeft < 0) secondsLeft = 0;
			clockPanel.textContent = ('0' + minutesLeft).slice(-2) + ':' + ('0' + secondsLeft).slice(-2);

			//change the mask height
			mask.style['min-height'] = (style === 'work') ? 
				mask.maxHeight - (seconds/duration * mask.maxHeight) + 'px' :
				(seconds/duration * mask.maxHeight) + 'px'; 

			//recurse while needed
			if (animRunning) {
				if (seconds < duration) window.requestAnimationFrame(animate);
				else {
					var newStyle = (style === 'work') ? 'rest' : 'work'; 
					animatePic(picAddr, newStyle);
				}
			}
			//animation cleanup code
			else {
				document.onclick = null;
				mask.parentNode.removeChild(mask);
				pic.parentNode.removeChild(pic);
				for (var i = 0; i < controls.length; i++)
					controls[i].style.visibility = 'visible';
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
	//animatePic('eggplant.png', 'relax');
});

