module.exports = function () {
    var speed = 'slow',
        d = $('#data');

    function clear() {
        d.html('');
    }

    function addError(error) {
        d.append('<div class="result result-error group">'
            + '<div class="geo-data group">'
            + '<h5>No results found</h5>'
            + '</div>'
            + '</div>');
    }

    function addResults(feature) {
        //_clear();
        // append the data
        var resultHTML = '<div class="result">'
            + '<h5><a class="lat-long" data-id="' + feature.properties.id
            + '" data-lat-long="[' + feature.geometry.coordinates[1]+ ', ' + feature.geometry.coordinates[0] + ']" href="#">'
            + feature.geometry.coordinates[1] + ', ' + feature.geometry.coordinates[0]
            + '</a> <div class="' + feature.geometry.type.toLowerCase() + ' geo-symbol"></h5>';
        if (feature.properties.service === 'point') {
            resultHTML += '<p class="placename">' + feature.properties.address + '</p>';
        } else if (feature.properties.service === 'census') {
            resultHTML += '<p class="placename">' + feature.properties.RFROMHN + ' - ' + feature.properties.RTOHN + ' ' + feature.properties.FULLNAME + ' ' + feature.properties.STATE + ' ' + feature.properties.ZIPR + '</p>';
        }
            
        resultHTML += '<p class="service">' + feature.properties.service + '</p></div>';
        d.append(resultHTML);
    }

    function activeResult(link) {
        $('.result').removeClass('active');
        $(link).closest($('.result')).addClass('active');
    }
    
    return {
        clear: clear,
        addResults: addResults,
        addError: addError,
        activeResult: activeResult
    };
};