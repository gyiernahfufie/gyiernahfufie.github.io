'use strict';

(function () {
  $(document).ready(function () { //once page is ready
      $('#play').click(playAudio());
  });
  
  function playAudio() {
    console.log('play audio');
  }
})();
