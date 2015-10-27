var results = [];

function _setID () {
    return String(Math.random()).replace('.', '');
}

function setProps(data) {
    results = [];

    $.each(data.addressPointsService.features, function (i, result) {
        result.properties.id = _setID();
        result.properties.service = 'address';
        results.push(result);
    });

    $.each(data.censusService.features, function (i, result) {
        result.properties.id = _setID();
        result.properties.service = 'census';
        results.push(result);
    });

    return results;
}

module.exports = {
    setProps: setProps
}