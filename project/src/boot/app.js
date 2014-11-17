var settings = require('tarifa-settings');
var dom = require('component-dom');
var afterTransition = require('after-transition');
var template = require('./settings');

var $node = dom(template);
$node.find('dd')[0].innerText = settings.product_name;
$node.find('dd')[1].innerText = settings.id;
$node.find('dd')[2].innerText = settings.version;

var $infoEl = dom('p.info');
$infoEl.append($node);

var circle = dom('.circle')[0];

// TODO: there is no splashscreen, why?
if (navigator.splashscreen && navigator.splashscreen.hide ) {
  navigator.splashscreen.hide();
}

//TODO: debug why splash screen takes so long and how to register to an event
// when the app is ready
afterTransition(circle, function() {
  $infoEl.addClass('fadeIn');
});
dom(circle).addClass('animate');