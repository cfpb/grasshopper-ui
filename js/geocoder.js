function single(address, callback) {
    $.ajax({
        url: '/api/geocoder/geocode/' + address,
        method: "GET"
    })
    .done(callback)
    .error(callback);
}

/*function batch(addresses) {

}*/

module.exports = {
    single: single
}
