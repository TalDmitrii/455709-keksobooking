'use strict';

window.sync = (function () {
  var syncFields = function (elem1, elem2, callback, possibleValues1, possibleValues2) {
    elem2.addEventListener('change', function () {
      callback(elem1, elem2.value, possibleValues1, possibleValues2);
    });
  };

  return {
    syncFields: syncFields
  };


})();
