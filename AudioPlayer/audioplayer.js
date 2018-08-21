'use strict';


(function () {

	var sound = new Howl({
	  src: ['Ansley.mp3']
	});
	var soundID;

	$(document).ready(function () { //once page is ready
		
		playAudio();
		$('#play').click(stopAudio());

	});
  
	function playAudio() {
		soundID = sound.play();
	}

	function stopAudio() {
		sound.stop(soundID);
		console.log('stopping: ' + soundID);
	}
})();
