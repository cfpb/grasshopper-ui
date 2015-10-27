module.exports = function(address) {
    return $.ajax({
        url: '/api/geocoder/geocode/' + address,
        method: "GET"
    });
}