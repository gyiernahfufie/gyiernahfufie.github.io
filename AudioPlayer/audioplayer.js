'use strict';


(function () {

	var sound = new Howl({
	  src: ['Ansley.mp3']
	});
	$(document).ready(function () { //once page is ready
		
		playAudio()
		$('#play').click(stopAudio());

	});
  
	function playAudio() {
		sound.play();
	}
	
	function stopAudio() {
		sound.stop();
	}
})();
