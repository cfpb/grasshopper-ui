var lat,
    lon,
    latID,
    longID,
    featureID;
var features = [];

function _setID(data) {
    //console.log('id data');
    //console.log(data);
    $.each(data.addressPointsService.features, function (i, result) {
        //console.log('status');
        //console.log(i);
        //console.log(result);
        // add to features array
        features.push(result);
        /*lat = addressPointsService.features[0].geometry.coordinates[1];
        lon = addressPointsService.features[0].geometry.coordinates[0];
        latID = lat.toString().replace('.', '').replace('-', '');
        lonID = lon.toString().replace('.', '').replace('-', '');
        featureID = latID + lonID;
        addressPointsService.features[0].properties.id = featureID;*/
    });

    $.each(data.censusService.features, function (i, result) {
        //console.log('status');
        //console.log(i);
        //console.log(result);
        // add to features array
        features.push(result);
        /*lat = addressPointsService.features[0].geometry.coordinates[1];
        lon = addressPointsService.features[0].geometry.coordinates[0];
        latID = lat.toString().replace('.', '').replace('-', '');
        lonID = lon.toString().replace('.', '').replace('-', '');
        featureID = latID + lonID;
        addressPointsService.features[0].properties.id = featureID;*/
    });
    // return the new array
    return features;
}

module.exports = function(address) {
    var geodata;
    var newadd = address.replace(/ /g, '+');
    $.ajax({
        url: '/api/geocoder/' + newadd,
        method: "GET",
        dataType: "json",
        async: false
    }).done(function(data) {
        geodata = _setID(data);
    }).error(function(request, status, error) {
        geodata = request.status;
    });

    /*
    // can use this as a response and comment out the ajax call
    var data = $.parseJSON('[{"type": "Feature","geometry": {"type": "Point", "coordinates": [-94.01536909650383, 36.17558950466898, 0.0] }, "properties": { "address": "20779 Lakeshore Springdale AR 72764", "alt_address": "", "load_date": 1428674694900 }}]');
    var geodata = _setID(data);
    */

    return geodata;
}