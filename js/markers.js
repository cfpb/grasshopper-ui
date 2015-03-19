var markers = function () {
    var markerCount = 0;
    function init(map) {
        var markerLayer = L.mapbox.featureLayer().addTo(map);
        // when a layer is added
        markerLayer.on('layeradd', function(e) {
            var marker = e.layer,
            feature = marker.feature;
            //var geoType = '';
            var wrapper = new dataWrapper();
            if (feature.geometry.type === 'Point') {
                // custom marker
                marker.setIcon(L.divIcon({
                  className: 'marker',
                  iconSize: [5, 5]
                }));
            }
            wrapper.addResults(feature);

            markerCount ++;
        });
        return markerLayer;
    }
    function clearLayers () {
        markerLayer.clearLayers();
    }

    return {
        init: init,
        clearLayers: clearLayers
    }
}