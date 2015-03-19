var dataWrapper = function () {
    var speed = 'slow',
    dw = $('.data-wrapper'),
    c = $('#count'),
    d = $('#data'),
    colorClass = 'good';

    function changeText(text) {
        $('.show-hide-data').text(text);
    }

    function clear () {
        console.log('clearing results');
        // clear featureLayer
        // clear previous results
        dw.slideDown(speed);
        //$('#data').css('display', 'none');
        //$('#count').css('display', 'none');
        d.html('');
        c.html('');
        changeText('Hide Data');
        // reset counts
        markerCount = 0;
        queryCount = 1;
    }

    function setColor (feature) {
        if (feature.relevance < .75 && feature.relevance > .5) {
            colorClass = 'ok';
        } else if (feature.relevance <= .5) {
            colorClass = 'bad';
        }
        return colorClass;
    }

    function showHide () {
        if (dw.is(':hidden')) {
            dw.slideDown(speed);
            changeText('Hide Data');
        } else {
            dw.slideUp(speed);
            changeText('Show Data');
        }
    }

    function addResults (feature) {
        // append the data
        d.append('<div class="result group">'
            + '<div class="geo-data">'
            + '<h5><a class="lat-long" data-id="' + feature.id + '" data-lat-long="[' + feature.center[1] + ', ' + feature.center[0] + ']" href="#">'
            + feature.center[1] + ', ' + feature.center[0]
            + '</a> <div class="' + feature.geometry.type.toLowerCase() + ' geo-symbol"></div></h5>'
            + '<p class="placename">' + feature.place_name + '</p>'
            + '<p class="type">' + feature.geometry.type + '</p>'
            + '<p class="relevance ' + setColor(feature) + '">Score: ' + feature.relevance + '</p>'
            + '<p class="source">' + feature.properties.attribution + '</p>'
            + '</div>'
            + '<h6>' + feature.properties.query + '</h6>'
            + '</div>');
    }
    
    return {
        clear: clear,
        showHide: showHide,
        addResults: addResults
    };
}