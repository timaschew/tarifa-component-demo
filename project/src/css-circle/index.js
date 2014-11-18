var domify = require('domify');
var afterTransition = require('after-transition');

var circleElement = domify(require('./template'));

module.exports = {
    element: circleElement,
    animate: function(cb) {
        afterTransition(circleElement, cb);
        circleElement.classList.add('animate');
    }
};