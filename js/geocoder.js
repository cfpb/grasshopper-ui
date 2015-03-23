var geocoder = function () {
    //var _queryName = '';
    // return the query name from the result
    function _setQueryName(location) {
        var _queryName = '';
        $.each(location, function (i, namePart) {
            if (i === location.length - 1) {
                _queryName = _queryName + ', <span>' + namePart + '</span>';
            } else {
                _queryName = _queryName + namePart + ' ';
            }
        });
        return _queryName;
    }

    // we need to show a few things that aren't in the feature
    // the actual query ran and the attribution
    function _setProperties(data) {
        // single address
        if (data.features === undefined) {
            $.each(data, function(i, result) {
                $.each(result.features, function(j, feature) {
                    feature.properties.query = _setQueryName(result.query);
                    feature.properties.attribution = result.attribution;
                });
            });
        // batch
        } else {
            $.each(data.features, function(j, feature) {
                feature.properties.query = _setQueryName(data.query);
                feature.properties.attribution = data.attribution;
            });
        }
        return data;
    }

    function setupGeoCoder() {
        var apiPre = 'http://api.tiles.mapbox.com/v4/geocode/';
        var apiSuf = '.json?access_token=pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
        // if there is no ; its a single address
        if ($('#address').val().indexOf(';') === -1) {
            var geocoder = 'mapbox.places';
            //http://api.tiles.mapbox.com/v4/geocode/{index}/{query}.json?access_token=<your access token>
        // batch
        } else {
            var geocoder = 'mapbox.places-permanent';
            //http://api.tiles.mapbox.com/v4/geocode/{index}/{query};{query}; ... ;{query}.json?access_token=<your access token>
        }
        var geodata = null;
        $.ajax({
            url: apiPre + geocoder + '/' + $('#address').val() + apiSuf,
            method: "GET",
            async: false,
            dataType: "json"
        }).done(function(data) {
            console.log(data);
            geodata = _setProperties(data);
        });
        return geodata;
    }

    return {
        setupGeoCoder: setupGeoCoder
    }
}