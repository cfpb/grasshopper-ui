var lat,
    lon,
    latID,
    longID,
    featureID;

function _setID(data) {
    $.each(data, function (i, result) {
        lat = result.geometry.coordinates[1];
        lon = result.geometry.coordinates[0];
        latID = lat.toString().replace('.', '').replace('-', '');
        lonID = lon.toString().replace('.', '').replace('-', '');
        featureID = latID + lonID;
        result.properties.id = featureID;
    });
    
    return data;
}

module.exports = function(address) {
    var geodata;
    $.ajax({
        url: '/api/addresses/points/' + address,
        method: "GET",
        dataType: "json",
        async: false
    }).done(function(data) {
        geodata = _setID(data);
    }).error(function(request, status, error) {
        console.log(request);
        console.log(request.status);
        console.log(status);
        console.log(error);
        geodata = request.status;
    });

    /*
    // can use this as a response and comment out the ajax call
    var data = $.parseJSON('[{"type": "Feature","geometry": {"type": "Point", "coordinates": [-94.01536909650383, 36.17558950466898, 0.0] }, "properties": { "address": "20779 Lakeshore Springdale AR 72764", "alt_address": "", "load_date": 1428674694900 }}]');
    var geodata = _setID(data);
    */

    return geodata;
}