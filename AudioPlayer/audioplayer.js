'use strict';


(function () {
	var sound = '';
	$(document).ready(function () { //once page is ready
		sound = new Howl({
		  src: ['Ansley.mp3']
		});
		playAudio();
		$('#play').click(stopAudio());

	});
  
	function playAudio() {
		soundID = sound.play();
	}

	function stopAudio() {
		sound.stop();
		console.log('stopping sound');
	}
})();
