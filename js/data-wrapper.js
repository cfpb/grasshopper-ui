var dataWrapper = function () {
    var speed = 'slow',
        dw = $('.data-wrapper'),
        c = $('#count'),
        d = $('#data'),
        //markerCount = 0,
        colorClass = 'good';

    function changeText(text) {
        $('.show-hide-data').text(text);
    }

    function clear() {
        d.html('');
        c.html('');
        changeText('Hide Data');
    }

    function setColor(relevance) {
        if (relevance < .75 && relevance > .5) {
            colorClass = 'ok';
        } else if (relevance <= .5) {
            colorClass = 'bad';
        }
        return colorClass;
    }

    function showHide() {
        if (dw.is(':hidden')) {
            dw.slideDown(speed);
            changeText('Hide Data');
        } else {
            dw.slideUp(speed);
            changeText('Show Data');
        }
    }

    function addResults(feature) {
        // append the data
        d.append('<div class="result group">'
            + '<div class="geo-data">'
            + '<h5><a class="lat-long" data-id="' + feature.id + '" data-lat-long="[' + feature.center[1] + ', ' + feature.center[0] + ']" href="#">'
            + feature.center[1] + ', ' + feature.center[0]
            + '</a> <div class="' + feature.geometry.type.toLowerCase() + ' geo-symbol"></div></h5>'
            + '<p class="placename">' + feature.place_name + '</p>'
            + '<p class="type">' + feature.geometry.type + '</p>'
            + '<p class="relevance ' + setColor(feature.relevance) + '">Score: ' + feature.relevance + '</p>'
            + '<p class="source">' + feature.properties.attribution + '</p>'
            + '</div>'
            + '<h6>' + feature.properties.query + '</h6>'
            + '</div>');
    }

    function addCount(markerCount, queryCount) {
        // append to count
        $('#count').append('Showing ' + markerCount + ' results based on ' + queryCount + ' queries');
        $('.show-hide-data').css('display', 'block');
    }
    
    return {
        clear: clear,
        showHide: showHide,
        addResults: addResults,
        addCount: addCount
    };
}