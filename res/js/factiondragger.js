var _factions = new Array();

$('#viewport').scroll(function() {
    $('#viewport').toggle();
});


$(function() {
    $('#viewport').
        scrollsync({targetSelector: '#viewport', axis : 'x'});
    $('#viewport').
        dragscrollable({dragSelector: '.dragger', acceptPropagatedEvent: false});
    $('#panel').
        scrollsync({targetSelector: '#panel', axis : 'x'});
    $('#panel').
        dragscrollable({dragSelector: '.dragger:first', acceptPropagatedEvent: true});

});

$(document).ready(function() {
    scrMapTo(5100, 4600)
});



function scrMapTo(x, y)
{
    $("#viewport").animate({scrollTop: y-(($(window).height())*0.5), scrollLeft: x-(($(window).width())*0.5)},500);
}
function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}