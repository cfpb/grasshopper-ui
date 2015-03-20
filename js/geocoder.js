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
    console.log('query name');
    console.log(location);
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
    //console.log('length = ' + data.features.length);
    // single address
    if (data.features === undefined) {
        console.log ('batch');
        $.each(data, function(i, result) {
            $.each(result.features, function(j, feature) {
                feature.properties.query = setQueryName(result.query);
                feature.properties.attribution = result.attribution;
            });
        });

    // batch
    } else {
        console.log ('single');
        //data.results.features[0].properties.query = setQueryName(data.results.query);
        //data.results.features[0].properties.attribution = data.results.attribution;
        $.each(data.features, function(j, feature) {
            console.log('query');
            //console.log(feature.query);
            feature.properties.query = setQueryName(data.query);
            feature.properties.attribution = data.attribution;
        });
        console.log('done looping');
    }
    return data;
}

// put this back in grasshopper
function renderResults(data, markerLayer) {
        console.log('rendering results');
        var updatedData = setProperties(data);
        
        // add the layer
        markerLayer.setGeoJSON(updatedData);
        // fit the map to the bounds of the markers
        map.fitBounds(markerLayer.getBounds());

        // append to count
        $('#count').append('Showing ' + markerCount + ' results based on ' + queryCount + ' queries');
        
        //wrapper.showHide();
        //$('#data').css('display', 'block');
        //$('#count').css('display', 'block');
        $('.show-hide-data').css('display', 'block');
    }

    function setupGeoCoder(markerLayer) {
        //console.log('geocoding');
        var apiPre = 'http://api.tiles.mapbox.com/v4/geocode/';
        var apiSuf = '.json?access_token=pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
        // if there is no ; its a single address
        if ($('#address').val().indexOf(';') === -1) {
            console.log('one address');
            var geocoder = 'mapbox.places';
            //http://api.tiles.mapbox.com/v4/geocode/{index}/{query}.json?access_token=<your access token>
            //geocoder.query($('#address').val(), renderResults);
        // else batch
        } else {
            queryCount = $('#address').val().split(';').length;
            var geocoder = 'mapbox.places-permanent';
            //http://api.tiles.mapbox.com/v4/geocode/{index}/{query};{query}; ... ;{query}.json?access_token=<your access token>
            //geocoder.query($('#address').val() , renderResults);
        }
        /*$.get(apiPre + geocoder + '/' + $('#address').val() + apiSuf, function(data) {
            console.log('data= ');
            console.log(data);
        });*/
        $.ajax({
            url: apiPre + geocoder + '/' + $('#address').val() + apiSuf,
            method: "GET",
            //data: { id : menuId },
            dataType: "json"
        }).done(function(data) {
            console.log(data);
            renderResults(data, markerLayer);
        });
        //renderResults(data);
    }

        

       /* // append to count
        
        //wrapper.showHide();
        //$('#data').css('display', 'block');
        //$('#count').css('display', 'block');
        $('.show-hide-data').css('display', 'block');
    }*/