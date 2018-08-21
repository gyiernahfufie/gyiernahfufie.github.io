'use strict';

(function () {
  $(document).ready(function () { //once page is ready
      $('#play').click(playAudio());
  });
  
  function playAudio() {
    var sound = new Howl({
      src: ['sound.mp3']
    });
    sound.play();
  }
})();
