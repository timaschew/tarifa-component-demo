// tarifa.json (injected during build time)
var settings = require('tarifa.json');
// remote dependencies (full name)
var domify = require('component-domify');
// remote dependencies (short name)
var query = require('query');

// local dependencies
var circle = require('css-circle');

// relative files
var settingsTemplate = require('./settings');

// this module is be loaded at the end of the app.js (autorequire)
module.exports = (function() {
    document.addEventListener('deviceready', function () {
        // load info template and fill in data
        var infoElement = domify(settingsTemplate);
        var infoEl = query('p.info');
        infoEl.appendChild(infoElement);
        query.all('dd', infoElement)[0].innerText = settings.product_name;
        query.all('dd', infoElement)[1].innerText = settings.id;
        query.all('dd', infoElement)[2].innerText = settings.version;

        // append circle
        var circleContainer = query('.circle-container');
        circleContainer.appendChild(circle.element);

        // hide splashscreen and start animation
        navigator.splashscreen.hide();
        circle.animate(function() {
          infoEl.classList.add('fadeIn');
        });
    });
})();