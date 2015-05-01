module.exports = function () {
    var speed = 'slow',
        d = $('#data');

    function _clear() {
        d.html('');
    }

    function addError(error) {
        _clear();
        d.append('<div class="result result-error group">'
            + '<div class="geo-data group">'
            + '<h5>No results found</h5>'
            + '</div>'
            + '</div>');
    }

    function addResults(feature) {
        _clear();
        // append the data
        d.append('<div class="result">'
            + '<h5><a class="lat-long" data-id="' + feature.properties.id
            + '" data-lat-long="[' + feature.geometry.coordinates[1]+ ', ' + feature.geometry.coordinates[0] + ']" href="#">'
            + feature.geometry.coordinates[1] + ', ' + feature.geometry.coordinates[0]
            + '</a> <div class="' + feature.geometry.type.toLowerCase() + ' geo-symbol"></h5>'
            + '<p class="placename">' + feature.properties.address + '</p>'
            + '</div>');
    }

    function activeResult(link) {
        $('.result').removeClass('active');
        $(link).closest($('.result')).addClass('active');
    }
    
    return {
        addResults: addResults,
        addError: addError,
        activeResult: activeResult
    };
};