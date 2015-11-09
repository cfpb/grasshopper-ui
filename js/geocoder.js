var lat,
    lon,
    latID,
    longID,
    featureID;
var features = [];

function _setProperties(data) {
    // check for status
    if (data.addressPointsService.status === 'ADDRESS_NOT_FOUND' && data.censusService.status === 'ADDRESS_NOT_FOUND') {
        features.push('No results found');
    } else {
        $.each(data.addressPointsService.features, function (i, result) {
            // set the id
            result.properties.id = String(Math.random()).replace('.', '');

            // add the service, needed to output address correctly
            result.properties.service = 'address';

            // add to features array
            features.push(result);
        });

        $.each(data.censusService.features, function (i, result) {
            // set the id
            result.properties.id = String(Math.random()).replace('.', '');

            // add the service, needed to output address correctly
            result.properties.service = 'census';

            // add to features array
            features.push(result);
        });
    }

    // return the new array
    return features;
}

module.exports = function(address) {
    var geodata;
    features = [];

    $.ajax({
        url: '/api/geocoder/geocode/' + address,
        method: "GET",
        dataType: "json",
        async: false
    }).done(function(data) {
        geodata = _setProperties(data);
    }).error(function(request, status, error) {
        geodata = request.status;
    });

    return geodata;
}