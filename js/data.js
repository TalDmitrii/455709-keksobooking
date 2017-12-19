'use strict';

window.data = (function () {
  var generatorOptions = {
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    MIN_PRICE: 1000,
    MAX_PRICE: 100000,
    COUNTS: 8,
    TYPES: ['flat', 'house', 'bungalo'],
    CHECKINS: ['12:00', '13:00', '14:00'],
    CHECKOUTS: ['12:00', '13:00', '14:00']
  };

  // функция возвращает случайное число в интервале от min до Max
  function getRandomFromRange(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
  }

  // функция возвращает случайный элемент из массива
  function getRandomFrom(possibleValues) {
    var randomIndex = Math.floor(Math.random() * possibleValues.length);
    return possibleValues[randomIndex];
  }

  // функция генерирует уникальный адрес аватарки для пина
  function generateUniqueURL(minAvatarID, maxAvatarID, generatedOffer) {
    var isAvatarUnique = false;
    while (!isAvatarUnique) {
      var randomURL = 'img/avatars/user0' + getRandomFromRange(minAvatarID, maxAvatarID) + '.png';
      isAvatarUnique = true;
      generatedOffer.forEach(function (elem) {
        if (elem.author.avatar === randomURL) {
          isAvatarUnique = false;
        }
      });
    }
    return randomURL;
  }


  // функция возвращает массив со случайным количсеством элементов в нем
  function getRandomFeatures(options) {
    var result = [];
    var dirtyFeatures = options.FEATURES.slice();
    var randomLength = Math.floor(Math.random() * options.FEATURES.length);
    for (var i = 0; i < randomLength; i++) {
      var randomIdx = Math.floor(Math.random() * dirtyFeatures.length);
      result.push(dirtyFeatures[randomIdx]);
      dirtyFeatures.splice(randomIdx, 1);
    }
    return result;
  }

  // функция создает данные для каждого предложения об аренде жилья
  function generateRandomOffers(options) {
    var randomOffers = [];
    for (var i = 0; i < options.COUNTS; i++) {
      randomOffers[i] = {
        'author': {
          'avatar': generateUniqueURL(1, 8, randomOffers)
        },

        'offer': {
          'title': getRandomFrom(options.TITLES),
          'address': '',
          'price': getRandomFromRange(1000, 1000000),
          'type': getRandomFrom(options.TYPES),
          'rooms': getRandomFromRange(1, 5),
          'guests': getRandomFromRange(1, 5),
          'checkin': getRandomFrom(options.CHECKINS),
          'checkout': getRandomFrom(options.CHECKOUTS),
          'features': getRandomFeatures(options),
          'description': '',
          'photos': []
        },

        'location': {
          'x': getRandomFromRange(300, 900),
          'y': getRandomFromRange(100, 500),

        }
      };
      randomOffers[i].offer.address = randomOffers[i].location.x + ', ' + randomOffers[i].location.y;
    }
    return randomOffers;
  }

  // экспортируем в глобальную область видимости
  return {
    generateRandomOffers: function () {
      return generateRandomOffers(generatorOptions);
    }
  };
})();
