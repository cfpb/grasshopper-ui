var dataWrapper = function () {
    var speed = 'slow',
        dw = $('.data-wrapper'),
        c = $('#count'),
        d = $('#data');

    function _changeText(text) {
        $('.show-hide-data').text(text);
    }

    function _setColor(relevance) {
        var _colorClass = 'good';
        if (relevance < .75 && relevance > .5) {
            _colorClass = 'ok';
        } else if (relevance <= .5) {
            _colorClass = 'bad';
        }
        return _colorClass;
    }

    function clear() {
        d.html('');
        c.html('');
        _changeText('Hide Data');
    }

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

    function addResults(feature) {
        // append the data
        d.append('<div class="result group">'
            + '<div class="geo-data group">'
            + '<h6>' + feature.properties.query + '</h6>'
            + '<h5><a class="lat-long" data-id="' + feature.id + '" data-lat-long="[' + feature.center[1] + ', ' + feature.center[0] + ']" href="#">'
            + feature.center[1] + ', ' + feature.center[0]
            + '</a> <div class="' + feature.geometry.type.toLowerCase() + ' geo-symbol"></div></h5>'
            + '<p class="placename">' + feature.place_name + '</p>'
            // + '<p class="type">' + feature.geometry.type + '</p>'
            // + '<p class="relevance ' + _setColor(feature.relevance) + '">Score: ' + feature.relevance + '</p>'
            // + '<p class="source">' + feature.properties.attribution + '</p>'
            + '</div>'
            + '</div>');
    }

    function addCount(markerCount, queryCount) {
        // append to count
        $('#count').append('Showing ' + markerCount + ' results based on ' + queryCount + ' queries');
        //$('.show-hide-data').css('display', 'block');
    }

    function activeResult(link) {
        $('.result').removeClass('active');
        $(link).closest($('.result')).addClass('active');
    }
    
    return {
        clear: clear,
        showHide: showHide,
        addResults: addResults,
        addCount: addCount,
        activeResult: activeResult
    };
}