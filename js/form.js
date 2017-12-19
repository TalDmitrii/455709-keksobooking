'use strict';

window.form = (function (sync, backend, msg, util) {
  var form = document.querySelector('.notice__form');
  var titleField = form.querySelector('.form__title');
  var addressField = form.querySelector('.form__address');
  var timeOutField = form.querySelector('.form__timeout');
  var timeInField = form.querySelector('.form__timein');
  var offerDialog = document.querySelector('.dialog');


  function syncValues(elem, value) {
    if (elem.value !== value) {
      elem.value = value;
    }
  }

  sync.syncFields(timeOutField, timeInField, syncValues);
  sync.syncFields(timeInField, timeOutField, syncValues);

  // Универсальная односторонняя синхронизация значения первого поля с минимальным значением второго
  // (в нашем проекте используется для синхронизации типа жилья и минимальной цены)

  var typeField = form.querySelector('.form__type');
  var priceField = form.querySelector('.form__price');

  function syncValueAndMinValue(elem, value, possibleValues1, possibleValues2) {
    switch (value) {
      case possibleValues2[0]:
        elem.min = possibleValues1[0];
        break;
      case possibleValues2[1]:
        elem.min = possibleValues1[1];
        break;
      case possibleValues2[2]:
        elem.min = possibleValues1[2];
        break;
      case possibleValues2[3]:
        elem.min = possibleValues1[3];
        break;
    }
  }

  sync.syncFields(priceField, typeField, syncValueAndMinValue, [1000, 0, 5000, 10000], ['flat', 'bungalo', 'house', 'palace']);

  // синхронизация количества гостей и количества комнат

  var capacityValues = {NO_GUESTS: '0', ONE_GUEST: '1', TWO_GUESTS: '2', THREE_GUESTS: '3'};
  var roomsCountValues = {ONE_ROOM: '1', TWO_ROOMS: '2', THREE_ROOMS: '3', HUNDRED_ROOMS: '100'};
  var roomsCountField = form.querySelector('.form__room_number');
  var capacityField = form.querySelector('.form__capacity');


  function syncRoomsCountWithCapacity(elem, value) {
    switch (value) { /* roomField.value */
      case roomsCountValues.ONE_ROOM:
        elem.value = capacityValues.ONE_GUEST;
        break;
      case roomsCountValues.HUNDRED_ROOMS:
        elem.value = capacityValues.NO_GUESTS;
        break;
      default:
        if (Number(elem.value) > Number(value) || Number(elem.value) === Number(capacityValues.NO_GUESTS)) {
          elem.value = capacityValues.ONE_GUEST;
        }
    }
  }

  function syncCapacityWithRoomsCount(elem, value) {
    switch (value) { /* capacity.value */
      case capacityValues.NO_GUESTS:
        elem.value = roomsCountValues.HUNDRED_ROOMS;
        break;
      default:
        if (Number(elem.value) < Number(value) || Number(elem.value) === Number(roomsCountValues.HUNDRED_ROOMS)) {
          elem.value = value;
        }
    }
  }

  sync.syncFields(capacityField, roomsCountField, syncRoomsCountWithCapacity);
  sync.syncFields(roomsCountField, capacityField, syncCapacityWithRoomsCount);

  // функция удаляет красную подсвтеку невалидного поля
  function removeErrorHighlight(evt) {
    evt.target.classList.remove('invalid');
    evt.target.removeEventListener('input', removeErrorHighlight);
  }
  // только если все три поля валидны, отправляем данные

  var successHandler = function () {
    offerDialog.classList.add('hidden');
    form.reset();
    msg.show('Данные загружены успешно!');
  };


  form.addEventListener('submit', function (evt) {
    if (addressField.value === '') {
      evt.preventDefault();
      addressField.classList.add('invalid');
    }

    if (titleField.value.length < 30 || titleField.value.length > 100) {
      evt.preventDefault();
      titleField.classList.add('invalid');
    }

    if (priceField.value < priceField.min || priceField.value > priceField.max) {
      evt.preventDefault();
      priceField.classList.add('invalid');
    }

    var invalidFields = form.querySelectorAll('.invalid');
    util.forEach(invalidFields, function (elem) {
      elem.addEventListener('input', removeErrorHighlight);
    });

    if (invalidFields.length === 0) {
      evt.preventDefault();
      backend.save(new FormData(form), successHandler, msg.show);
    }
  });

})(window.sync, window.backend, window.msg, window.util);
