var $ = require('jquery');

var speed = 'slow',
    d = $('#data');

module.exports = function() {
    var wrapper = {};

    wrapper.clear = function() {
        d.empty();
        d.slideUp(speed);
    }

    wrapper.show = function() {
        d.slideDown(speed);
    }

    wrapper.addError = function(error) {
        d.append('<div class="result result-error group">'
            + '<div class="geo-data group">'
            + '<h5>No results found</h5>'
            + '</div>'
            + '</div>');
    }

    wrapper.addResults = function(feature) {
        // append the data
        var resultHTML = '<div class="result">'
            + '<h5><a class="lat-long" data-id="' + feature.properties.id
            + '" data-lat-long="[' + feature.geometry.coordinates[1]+ ', ' + feature.geometry.coordinates[0] + ']" href="#">'
            + feature.geometry.coordinates[1] + ', ' + feature.geometry.coordinates[0]
            + '</a> <div class="' + feature.geometry.type.toLowerCase() + ' geo-symbol"></h5>';
        
        // results are different for point and census
        if (feature.properties.service === 'address') {
            resultHTML += '<p class="placename">' + feature.properties.address + '</p>';
            resultHTML += '<p class="score">Score: ' + feature.properties.match.toFixed(2) + '</p>';
        } else if (feature.properties.service === 'census') {
            resultHTML += '<p class="placename">' + feature.properties.RFROMHN + ' - ' + feature.properties.RTOHN + ' ' + feature.properties.FULLNAME + ' ' + feature.properties.STATE + ' ' + feature.properties.ZIPR + '</p>';
        }
            
        resultHTML += '<p class="service">' + feature.properties.service + '</p></div>';

        d.append(resultHTML);
    }

    wrapper.activeResult = function(link) {
        $('.result').removeClass('active');
        $(link).closest($('.result')).addClass('active');
    }
    
    return wrapper;
};