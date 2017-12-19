'use strict';

window.backend = (function () {

  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var cache = [];

  function save(data, onLoad, onError) {

    var xhr = new XMLHttpRequest();// создаем новый запрос к серверу
    xhr.responseType = 'json'; // указываем формат 'json'

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000; // 10s

    xhr.open('POST', SERVER_URL); // указываем метод и адрес
    xhr.send(data); // отправляем запрос с данными

  }

  function load(onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', SERVER_URL + '/data');
    if (cache.length !== 0) {
      onLoad(cache);
    } else {
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          cache = xhr.response;
          onLoad(xhr.response);
        } else {
          onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });
      xhr.timeout = 10000; // 10s
      xhr.send();
    }
  }

  return {
    save: save,
    load: load,
  };


})();
