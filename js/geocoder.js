var geocoder = function () {
    function setupGeoCoder() {

        /*
        var geodata = null;

        $.ajax({
            url: 'http://awsdevhmdal05:31010/addresses/points/20779',
            method: "GET",
            async: false,
            dataType: "json",
            crossDomain: true
        }).done(function(data) {
            console.log(data);
            geodata = data;
        }).error(function(request, status, error) {
            console.log(request);
            console.log(status);
            console.log(error);
        });

        return geodata;
        */

        // For testing the UI, comment out the ajax call and the return above
        // this return is a hard-coded response from the api
        return $.parseJSON('[{"type": "Feature","geometry": {"type": "Point", "coordinates": [-94.01536909650383, 36.17558950466898, 0.0] }, "properties": { "address": "20779 Lakeshore Springdale AR 72764", "alt_address": "", "load_date": 1428674694900 }}]');
    }

    return {
        setupGeoCoder: setupGeoCoder
    }
}