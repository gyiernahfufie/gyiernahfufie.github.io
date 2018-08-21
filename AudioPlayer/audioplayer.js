'use strict';


(function () {

	$(document).ready(function () { //once page is ready
		
		playAudio();
		$('#play').click(stopAudio());

	});
  
	function playAudio() {
		var sound = new Howl({
		  src: ['Ansley.mp3']
		});
		sound.play();
	}

	function stopAudio() {
		sound.stop();
		console.log('stopping sound');
	}
})();
