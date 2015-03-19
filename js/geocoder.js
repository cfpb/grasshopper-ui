console.log('geocoder loaded');
/*
dealing with data
- setting query name (friendly to read)
- adding new properties to the feature
- rendering results
- clearing results
- creating the geocoder
*/

// return the query name from the result
function setQueryName(location) {
    var queryName = '';
    $.each(location, function (i, namePart) {
        if (i === location.length - 1) {
            queryName = queryName + ', <span>' + namePart + '</span>';
        } else {
            queryName = queryName + namePart + ' ';
        }
        //console.log(queryName);
    });
    return queryName;
}

// we need to show a few things that aren't in the feature
// the actual query ran and the attribution
function setProperties(data) {
    // single address
    if (data.results.length === undefined) {
        console.log ('single');
        //data.results.features[0].properties.query = setQueryName(data.results.query);
        //data.results.features[0].properties.attribution = data.results.attribution;
        $.each(data.results.features, function(j, feature) {
            feature.properties.query = setQueryName(data.results.query);;
            feature.properties.attribution = data.results.attribution;
        });
    // batch
    } else {
        console.log ('batch');
        $.each(data.results, function(i, result) {
            $.each(result.features, function(j, feature) {
                feature.properties.query = setQueryName(result.query);;
                feature.properties.attribution = result.attribution;
            });
        });
    }
    return data;
}
/*
function renderResults(err, data) {
        console.log('rendering results');
        if (data.results.length === undefined) {
                console.log ('single');
                //data.results.features[0].properties.query = setQueryName(data.results.query);
                //data.results.features[0].properties.attribution = data.results.attribution;
                $.each(data.results.features, function(j, feature) {
                    feature.properties.query = setQueryName(data.results.query);
                    feature.properties.attribution = data.results.attribution;
                });
            // batch
            } else {
                console.log ('batch');
                $.each(data.results, function(i, result) {
                    $.each(result.features, function(j, feature) {
                        feature.properties.query = setQueryName(result.query);
                        feature.properties.attribution = result.attribution;
                    });
                });
            }
            // add the layer
        markerLayer.setGeoJSON(data.results);
        // fit the map to the bounds of the markers
        map.fitBounds(markerLayer.getBounds());
        //return updatedData;
    }

    function setupGeoCoder(markerLayer) {
        console.log('geocoding');
        console.log(markerLayer);
        // if there is no ; its a single address
        if ($('#address').val().indexOf(';') === -1) {
            console.log('one address');
            var geocoder = L.mapbox.geocoder('mapbox.places');
            var newData = geocoder.query($('#address').val(), renderResults);
        // else batch
        } else {
            queryCount = $('#address').val().split(';').length;
            var geocoder = L.mapbox.geocoder('mapbox.places-permanent');
            var newData = geocoder.query($('#address').val() , renderResults);
        }

        

        // append to count
        
        //wrapper.showHide();
        //$('#data').css('display', 'block');
        //$('#count').css('display', 'block');
        $('.show-hide-data').css('display', 'block');
    }*/