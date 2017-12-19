'use strict';

window.msg = (function () {
  var MSG_SHOW_DURATION = 1500;
  function showMessage(errorMessage) {
    var message = document.querySelector('.message');
    message.textContent = errorMessage;
    message.style.display = 'block';
    setTimeout(function () {
      message.style.display = 'none';
    }, MSG_SHOW_DURATION);
  }

  return {
    show: showMessage
  };

})();
