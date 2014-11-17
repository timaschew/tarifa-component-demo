var settings = require('tarifa-settings');
var domify = require('component-domify');
var query = require('component-query');
var afterTransition = require('after-transition');
var template = require('./settings');

// this module is be loaded at the endn of the app.js (autorequire)
module.exports = (function() {
document.addEventListener('deviceready', function () {
    var node = domify(template);
    var infoEl = query('p.info');
    infoEl.appendChild(node);
    query.all('dd', node)[0].innerText = settings.product_name;
    query.all('dd', node)[1].innerText = settings.id;
    query.all('dd', node)[2].innerText = settings.version;
    var circle = query('.circle');

    navigator.splashscreen.hide();
    afterTransition(circle, function() {
      infoEl.classList.add('fadeIn');
    });
    circle.classList.add('animate');
  });    
})();
