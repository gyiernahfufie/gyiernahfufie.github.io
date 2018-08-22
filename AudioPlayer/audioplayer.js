'use strict';


(function () {
	var sound = '';
	$(document).ready(function () { //once page is ready
		var param = getJsonFromUrl();
		console.log(param);
		
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
	}

	function stopAudio() {
		sound.stop();
		console.log('stopping sound');
	}

	function getJsonFromUrl() {
	  var query = location.search.substr(1);
	  var result = {};
	  query.split("&").forEach(function(part) {
	    var item = part.split("=");
	    result[item[0]] = decodeURIComponent(item[1]);
	  });
	  return result;
	}

})();
