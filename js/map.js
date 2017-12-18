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
var map = document.querySelector('.map');
var triggerPopup = false;
var popup = null;
var activeElem = null;

map.addEventListener('mouseup', mapMouseupHandler);
map.addEventListener('click', pinClickHandler);

function pinClickHandler(event) {
  var clickedElement = event.target;
  var mapElem = clickedElement.closest('button');
  var srcElem = clickedElement.getAttribute('src');
  var i = 0;

  if (!mapElem) {return};
  if (!map.contains(mapElem)) {return};

  if (activeElem) {
    activeElem.classList.remove('map__pin--active');
  }

  activeElem = mapElem;
  activeElem.classList.add('map__pin--active');

  for (i; i < ads.length; i++) {
    if (ads[i].author.avatar === srcElem) {
      renderCard(ads[i]);
    }
  }
}

function mapMouseupHandler() {
  var form = document.querySelector('.notice__form');
  var pins = null;
  var j = 0;

  map.classList.remove('map--faded');
  form.classList.remove('notice__form--disabled');
  map.removeEventListener('mouseup', mapMouseupHandler);
  getFragment();

  pins = map.querySelectorAll('.map__pin');

  for (j; j < pins.length; j++) {
    pins[j].addEventListener('keydown', function (event) {
      if (event.keyCode === 13) {
        var clickedElement = event.target;
        var srcElem = clickedElement.querySelector('img').getAttribute('src');
        var i = 0;

        for (i; i < ads.length; i++) {
          if (ads[i].author.avatar === srcElem) {
            renderCard(ads[i]);
          }
        }
      }
    });
  }
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function changeArr(array) {
  var newArray = [];
  var i = 0;

  for (i; i < getRandomInRange(0, array.length); i++) {
    newArray[i] = array[i];
  }

  return newArray;
}

function getAdsArray(count, titles, types, times, features) {
  var i = 0;
  var object = null;
  var result = [];

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
  var button = template.querySelector('.map__pin');
  var pinElement = null;

  pinElement = button.cloneNode(true);

  pinElement.style.left = array.location.x + 'px';
  pinElement.style.top = array.location.y + 'px';
  pinElement.querySelector('img').setAttribute('src', array.author.avatar);

  return pinElement;
}

function getFragment() {
  var pinFragment = document.createDocumentFragment();
  var similarListElement = document.querySelector('.map__pins');

  for (var i = 0; i < ads.length; i++) {
    pinFragment.appendChild(renderPin(ads[i]));
  }

  similarListElement.appendChild(pinFragment);
}

function renderCard(object) {
  var cardFragment = document.createDocumentFragment();
  var elementLi = null;
  var card = null;
  var nextElem = null;
  var i = 0;

  if (!triggerPopup) {
    card = template.querySelector('.popup').cloneNode(true);
  } else {
    card = popup;
  }

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

  if (triggerPopup === false) {
    nextElem = document.querySelector('.map__filters-container');
    map.insertBefore(card, nextElem);
    popup = map.querySelector('.popup');
    addEventPopup();
    triggerPopup = true;
  }
  popup.classList.remove('hidden');
}

function addEventPopup() {
  var pins = map.querySelector('.map__pins');

  popup.querySelector('.popup__close').addEventListener('click', closeClickHandler);

  map.addEventListener('keydown', function (event) {
    if (event.keyCode === 27) {
      popup.classList.add('hidden');
      pins.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
  });
}

function closeClickHandler() {
  var pins = map.querySelector('.map__pins');

  popup.classList.add('hidden');
  pins.querySelector('.map__pin--active').classList.remove('map__pin--active');
}
