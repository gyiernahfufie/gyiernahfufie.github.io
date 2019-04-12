'use strict';


(function () {
	var sound = '';
	$(document).ready(function () { //once page is ready
		var param = getJsonFromUrl();
		console.log('loading: '+ param.file);

		sound = new Howl({
		  src: [param.file]
		});

		if (param.file != undefined) {
			//playAudio();
			pauseAudio();
		}

		$('#playButton').click(playAudio);
		$('#stopButton').click(stopAudio);
		$('#pauseButton').click(pauseAudio);
	});

	function playAudio() {
		console.log('play audio');
		var soundID = sound.play();
		$('#playButton').hide();
		$('#pauseButton').show();
	}

	function stopAudio() {
		sound.stop();
		console.log('stopping sound');
	}

	function pauseAudio() {
		sound.pause();
		console.log('pausing sound');
		$('#pauseButton').hide();
		$('#playButton').show();
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
