module.exports = function () {
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

    function setID(feature) {
        var lat = feature.geometry.coordinates[1];
        var lon = feature.geometry.coordinates[0];
        var latID = lat.toString().replace('.', '').replace('-', '');
        var lonID = lon.toString().replace('.', '').replace('-', '');
        var featureID = latID + lonID;
        return featureID;
    }

    function addResults(feature) {
       console.log('addResults');
        // append the data
        d.append('<div class="result group">'
            + '<div class="geo-data group">'
            // + '<h6>' + feature.properties.query + '</h6>'
            + '<h5><a class="lat-long" data-id="' + setID(feature)
            + '" data-lat-long="[' + feature.geometry.coordinates[1]+ ', ' + feature.geometry.coordinates[0] + ']" href="#">'
            + feature.geometry.coordinates[1] + ', ' + feature.geometry.coordinates[0]
            + '</a> <div class="' + feature.geometry.type.toLowerCase() + ' geo-symbol"></div></h5>'
            + '<p class="placename">' + feature.properties.address + '</p>'
            // + '<p class="type">' + feature.geometry.type + '</p>'
            // + '<p class="relevance ' + _setColor(feature.relevance) + '">Score: ' + feature.relevance + '</p>'
            // + '<p class="source">' + feature.properties.attribution + '</p>'
            + '</div>'
            + '</div>');
    }

    function addCount(markerCount, queryCount) {
        console.log('addCount');
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
        activeResult: activeResult,
        setID: setID
    };
};