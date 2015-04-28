var geocoder = function () {
    function _setID(data) {
        var lat,
            lon,
            latID,
            longID,
            featureID;
        $.each(data, function (i, result) {
            lat = result.geometry.coordinates[1];
            lon = result.geometry.coordinates[0];
            console.log(lat);
            latID = lat.toString().replace('.', '').replace('-', '');
            lonID = lon.toString().replace('.', '').replace('-', '');
            featureID = latID + lonID;
            result.properties.id = featureID;
        });
        
        return data;
    }

    function setupGeoCoder() {
        /*
        $.ajax({
            url: 'http://awsdevhmdal05:31010/addresses/points/20779',
            method: "GET",
            async: false,
            dataType: "json",
            crossDomain: true
        }).done(function(data) {
            console.log(data);
            //geodata = _setProperties(data);
        }).error(function(request, status, error) {
            console.log(request);
            console.log(status);
            console.log(error);
        });
        */
        var data = $.parseJSON('[{"type": "Feature","geometry": {"type": "Point", "coordinates": [-94.01536909650383, 36.17558950466898, 0.0] }, "properties": { "address": "20779 Lakeshore Springdale AR 72764", "alt_address": "", "load_date": 1428674694900 }}]');
        var geodata = _setID(data);
        return geodata;
    }

    return {
        setupGeoCoder: setupGeoCoder
    }
}