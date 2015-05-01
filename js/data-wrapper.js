module.exports = function () {
    var speed = 'slow',
        //c = $('#count'),
        d = $('#data');

    /*
    function _changeText(text) {
        $('.show-hide-data').text(text);
    }
    */

    /*
    // use this later when we add relevancy
    function _setColor(relevance) {
        var _colorClass = 'good';
        if (relevance < .75 && relevance > .5) {
            _colorClass = 'ok';
        } else if (relevance <= .5) {
            _colorClass = 'bad';
        }
        return _colorClass;
    }
    */

    function _clear() {
        d.html('');
        //c.html('');
        //_changeText('Hide Data');
    }

    /*
    // not showing/hiding anything yet
    function showHide() {
        if (dw.is(':hidden')) {
            dw.css('visibility', 'visible');
            dw.slideDown(speed);
            _changeText('Hide Data');
        } else {
            dw.slideUp(speed);
            _changeText('Show Data');
        }
    }
    */
    function addError(error) {
        _clear();
        d.append('<div class="result group">'
            + '<div class="geo-data group">'
            // + '<h6>' + feature.properties.query + '</h6>'
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

    /*
    function addCount(markerCount, queryCount) {
        console.log('addCount');
        // append to count
        $('#count').append('Showing ' + markerCount + ' results based on ' + queryCount + ' queries');
    }
    */

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