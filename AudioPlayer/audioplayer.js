'use strict';


(function () {
	var sound = '';
	$(document).ready(function () { //once page is ready
		sound = new Howl({
		  src: ['Ansley.mp3']
		});
		//playAudio();
		$('#playButton').click(playAudio);
		$('#stopButton').click(stopAudio);
	});

	function playAudio() {
		console.log('play audio');
		var soundID = sound.play();
	};

	function stopAudio() {
		sound.stop();
		console.log('stopping sound');
	};
})();
