'use strict';

window.search = (function (map, backend, util, msg) {

  var nearbyAdsList = document.querySelector('.tokyo__pin-map');
  var filtersForm = document.querySelector('.tokyo__filters');
  var housingType = filtersForm.querySelector('#housing_type');
  var housingRooms = filtersForm.querySelector('#housing_room-number');
  var housingGuests = filtersForm.querySelector('#housing_guests-number');
  var housingPrice = filtersForm.querySelector('#housing_price');
  var housingFeatures = filtersForm.querySelectorAll('.feature input');
  var offers = [];

  function removePins() { // функция, для удаления всех пинов с карты (кроме main pin)
    var pins = nearbyAdsList.querySelectorAll('.pin');
    util.forEach(pins, function (elem) {
      if (!elem.classList.contains('pin__main')) {
        elem.remove();
      }
    });
  }

  var filterOffersByType = function (elem) { // фильтр по типу жилья
    if (housingType.value === 'any') {
      return offers;
    } else {
      return elem.offer.type === housingType.value;
    }
  };

  var filterOffersByRoomsCount = function (elem) { // фильтр по количеству комнат
    if (housingRooms.value === 'any') {
      return offers;
    } else {
      return elem.offer.rooms === Number(housingRooms.value);
    }
  };

  var filterOffersByPrice = function (elem) { // фильтр по цене
    switch (housingPrice.value) {
      case 'any':
        return offers;
      case 'middle':
        return elem.offer.price >= 10000 && elem.offer.price <= 50000;
      case 'low':
        return elem.offer.price < 10000;
      case 'high':
        return elem.offer.price > 50000;
      default:
        return false;
    }
  };


  var filterOffersByGuestsCount = function (elem) { // фильтр по количеству гостей
    if (housingGuests.value === 'any') {
      return offers;
    } else {
      return elem.offer.guests === Number(housingGuests.value);
    }
  };

  var filterOffersByFeatures = function (elem) { // фильтр по features
    var featureCheckedCheckboxes = filtersForm.querySelectorAll('.feature input[type="checkbox"]:checked');
    var checkedFeatures = Array.prototype.map.call(featureCheckedCheckboxes, function (checkbox) {
      return checkbox.value;
    });
    return checkedFeatures.every(function (feature) {
      return elem.offer.features.indexOf(feature) > -1;
    });
  };

  var filteringFucntions = [filterOffersByType, filterOffersByRoomsCount, filterOffersByPrice, filterOffersByGuestsCount, filterOffersByFeatures];

  var updatePins = function () { // функция фильтрует offers и отправляет на отрисовку
    removePins();
    var filteredData = filteringFucntions.reduce(function (initial, elem) {
      return initial.filter(elem);
    }, offers);
    map.render(filteredData);
  };

  var filters = document.querySelectorAll('.tokyo__filter');

  util.forEach(filters, function (elem) {
    elem.addEventListener('change', util.debounce(updatePins));
  });

  util.forEach(housingFeatures, function (elem) {
    elem.addEventListener('change', util.debounce(updatePins));
  });

  var successHandler = function (data) {
    offers = data;
  };

  backend.load(successHandler, msg.show);


})(window.map, window.backend, window.util, window.msg);
