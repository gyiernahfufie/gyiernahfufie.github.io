'use strict';

(function () {
  $(document).ready(function () { //once page is ready
  	var sound = new Howl({
      src: ['Ansley.mp3']
    });
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
