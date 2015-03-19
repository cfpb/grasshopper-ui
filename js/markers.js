// featureLayer for markers and add it to the map
var markerLayer = L.mapbox.featureLayer().addTo(map);

// when a layer is added
markerLayer.on('layeradd', function(e) {
    var marker = e.layer,
    feature = marker.feature;
    var geoType = '';

    // if it's a point
    if (feature.geometry.type === 'Point') {
        // custom marker
        marker.setIcon(L.divIcon({
          className: 'marker',
          iconSize: [5, 5]
        }));

        geoType = '<div class="point geo-symbol"></div>';
    } else if (feature.geometry.type === 'LineString') {
        geoType = '<div class="line geo-symbol"></div>';
    } else if (feature.geometry.type === 'MultiLineString') {
        geoType = '<div class="line geo-symbol"></div><div class="line geo-symbol"></div>';
    }

        var colorClass = 'good';
        if (feature.relevance < .75 && feature.relevance > .5) {
            colorClass = 'ok';
        } else if (feature.relevance <= .5) {
            colorClass = 'bad';
        }
        
        // append the data
        $('#data').append('<div class="result group">'
            + '<div class="geo-data">'
            + '<h5><a class="lat-long" data-id="' + feature.id + '" data-lat-long="[' + feature.center[1] + ', ' + feature.center[0] + ']" href="#">'
            + feature.center[1] + ', ' + feature.center[0]
            + '</a> ' + geoType + '</h5>'
            + '<p class="placename">' + feature.place_name + '</p>'
            + '<p class="type">' + feature.geometry.type + '</p>'
            + '<p class="relevance ' + colorClass + '">Score: ' + feature.relevance + '</p>'
            + '<p class="source">' + feature.properties.attribution + '</p>'
            + '</div>'
            + '<h6>' + feature.properties.query + '</h6>'
            + '</div>');

        markerCount ++;
   // }
});