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

        // actually the splash screen appears only for some milliseconds
        // avoid this flickering by delay it for 500ms
        setTimeout(function() {
            // to avoid flickering when injecting templates: show at startup
            // only the body element, hide everything inside ('#before-init')
            // show it when all templates were injected

            // hide splashscreen and start animation
            query('#before-init').id = '';
            navigator.splashscreen.hide();
            // just delay again 
            setTimeout(function() {
                circle.animate(function() {
                    infoEl.classList.add('fadeIn');
                });
            }, 500);
        }, 500);
        
        
    });
})();