var lat,
    lon,
    latID,
    longID,
    featureID;
var features = [];

function _setID(data) {
    // check for status
    if (data.addressPointsService.status === 'ADDRESS_NOT_FOUND' && data.censusService.status === 'ADDRESS_NOT_FOUND') {
        features.push('No results found');
    }
    $.each(data.addressPointsService.features, function (i, result) {
        // set the id
        lat = result.geometry.coordinates[1];
        lon = result.geometry.coordinates[0];
        latID = lat.toString().replace('.', '').replace('-', '');
        lonID = lon.toString().replace('.', '').replace('-', '');
        featureID = latID + lonID;
        result.properties.id = featureID;

        // add the service
        // needed to output address correctly
        result.properties.service = 'point';

        // add to features array
        features.push(result);
    });

    $.each(data.censusService.features, function (i, result) {
        // set the id
        lat = result.geometry.coordinates[1];
        lon = result.geometry.coordinates[0];
        latID = lat.toString().replace('.', '').replace('-', '');
        lonID = lon.toString().replace('.', '').replace('-', '');
        featureID = latID + lonID;
        result.properties.id = featureID;

        // add the service
        // needed to output address correctly
        result.properties.service = 'census';

        // add to features array
        features.push(result);
    });

    // return the new array
    return features;
}

module.exports = function(address) {
    features = [];
    var geodata;
    var newadd = address.replace(/ /g, '+');
    
    $.ajax({
        url: '/api/geocoder/geocode/' + newadd,
        method: "GET",
        dataType: "json",
        async: false
    }).done(function(data) {
        geodata = _setID(data);
    }).error(function(request, status, error) {
        geodata = request.status;
    });

    return geodata;
}