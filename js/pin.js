'use strict';

window.pin = (function () {
  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 40;
  var PIN_OFFSET = {
    left: PIN_WIDTH / 2,
    top: PIN_HEIGHT
  };

  function renderPin(generatedOffer, idx) {
    var adsElement = document.createElement('div');
    var adsImg = document.createElement('img');
    adsElement.appendChild(adsImg);
    adsElement.classList.add('pin');
    adsElement.style.left = (generatedOffer.location.x - PIN_OFFSET.left) + 'px';
    adsElement.style.top = (generatedOffer.location.y - PIN_OFFSET.top) + 'px';
    adsElement.tabIndex = 0;
    adsImg.src = generatedOffer.author.avatar;
    adsImg.classList.add('rounded');
    adsImg.style.width = PIN_WIDTH + 'px';
    adsImg.style.height = PIN_HEIGHT + 'px';
    adsElement.dataset.index = idx;
    return adsElement;
  }


  return {
    renderPin: renderPin
  };

})();
