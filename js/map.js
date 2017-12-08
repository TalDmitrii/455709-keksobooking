'use strict';

var translate = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом'
};

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPES = [
  'flat',
  'house',
  'bungalo'
];

var TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var ads = getAdsArray(8, TITLES, TYPES, TIMES, FEATURES);
var template = document.querySelector('template').content;

deleteClass();
getFragment();
insertCard(ads[0]);

function deleteClass() {
  var mapObj = document.querySelector('.map');
  mapObj.classList.remove('map--faded');
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function changeArr(array) {
  var newArray = [],
      i = 0;

  for (i; i < getRandomInRange(0, array.length); i++) {
    newArray[i] = array[i];
  }

  return newArray;
}

function getAdsArray(count, titles, types, times, features) {
  var i = 0,
      object = null,
      result = [];

  for (i; i < count; i++) {
    object = {
        'author': {
          'avatar': 'img/avatars/user' + ('0' + (i + 1)).slice(-2) + '.png'
        },
        'offer': {
          'title': titles[i],
          'price': getRandomInRange(1000, 1000000),
          'type': types[getRandomInRange(0, types.length)],
          'rooms': getRandomInRange(1, 5),
          'guests': getRandomInRange(1, 10),
          'checkin': times[getRandomInRange(0, times.length)],
          'checkout': times[getRandomInRange(0, times.length)],
          'features': changeArr(features),
          'description': ' ',
          'photos': []
        },
        'location': {
          'x': getRandomInRange(300, 900),
          'y': getRandomInRange(100, 500)
        }
    };
    object.offer.address = object.location.x + ',' + object.location.y;
    result.push(object);
  }
  return result;
}

function renderPin(array) {
  var button = template.querySelector('.map__pin'),
      pinElement = null;

      pinElement = button.cloneNode(true);

      pinElement.style.left = array.location.x + 'px';
      pinElement.style.top = array.location.y + 'px';
      pinElement.querySelector('img').setAttribute('src', array.author.avatar);

      return pinElement;
}

function getFragment() {
  var pinFragment = document.createDocumentFragment(),
      similarListElement = document.querySelector('.map__pins');

  for (var i = 0; i < ads.length; i++) {
    pinFragment.appendChild(renderPin(ads[i]));
  }

  similarListElement.appendChild(pinFragment);
}

function renderCard(object) {
  var cardFragment = document.createDocumentFragment(),
      elementLi = null,
      card = null,
      i = 0;

  card = template.cloneNode(true);

  card.querySelector('h3').textContent = object.offer.title;
  card.querySelector('small').textContent = object.offer.address;
  card.querySelector('.popup__price').innerHTML = object.offer.price + ' &#x20bd; /ночь';
  card.querySelector('h4').textContent = translate[object.offer.type];
  card.querySelector('.rooms--guests').textContent = object.offer.rooms + ' для ' + object.offer.guests + ' гостей';
  card.querySelector('.check--times').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
  card.querySelector('.popup__features').innerHTML = '';

  for (i; i < object.offer.features.length; i++) {
    elementLi = document.createElement('li');
    elementLi.className = 'feature feature--' + object.offer.features[i];

    cardFragment.appendChild(elementLi);
  }

  card.querySelector('.popup__features').appendChild(cardFragment);
  card.querySelector('.card--description').textContent = object.offer.description;
  card.querySelector('.popup__avatar').setAttribute('src', object.author.avatar);

  return card;
}

function insertCard(object) {
  var nextElem = document.querySelector('.map__filters-container'),
      insCard = document.querySelector('.map');

  insCard.insertBefore(renderCard(object), nextElem);
}
