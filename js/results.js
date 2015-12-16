var $ = require('jquery');

var speed = 'slow',
    d = $('#data');

function clear() {
        d.empty();
        d.slideUp(speed);
    }

function show() {
    d.slideDown(speed);
}

function error(error) {
    d.append('<div class="result result-error group">'
        + '<div class="geo-data group">'
        + '<h5>' + error + '</h5>'
        + '</div>'
        + '</div>');
}

function add(feature) {
    var resultHTML = '<div class="result">'
        + '<h5><a class="lat-long" data-id="' + feature.properties.id
        + '" data-lat-long="[' + feature.geometry.coordinates[1]+ ', ' + feature.geometry.coordinates[0] + ']" href="#">'
        + feature.geometry.coordinates[1] + ', ' + feature.geometry.coordinates[0]
        + '</a> <div class="' + feature.properties.source + ' geo-symbol"></h5>';

    if (feature.properties.source === 'state-address-points') {
        resultHTML += '<p class="placename">' + feature.properties.address + '</p>';
        //resultHTML += '<p class="score">Score: ' + feature.properties.match.toFixed(2) + '</p>';
    } else if (feature.properties.source === 'census-tiger') {
      var stNum, zip;
      if(feature.properties.RFROMHN !== null) {
        stNum = feature.properties.RFROMHN + ' - ' + feature.properties.RTOHN;
        zip = feature.properties.ZIPR;
      } else {
        stNum = feature.properties.LFROMHN + ' - ' + feature.properties.LTOHN;
        zip = feature.properties.ZIPL;
      }
        resultHTML += '<p class="placename">' + stNum + ' ' + feature.properties.FULLNAME + ' ' + feature.properties.STATE + ' ' + zip + '</p>';
    }

    resultHTML += '<p class="service">' + feature.properties.source + '</p></div>';

    d.append(resultHTML);
}

function active(link) {
    $('.result').removeClass('active');
    $(link).closest($('.result')).addClass('active');
}

module.exports = {
    clear: clear,
    show: show,
    error: error,
    add: add,
    active, active
}
