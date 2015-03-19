$(function() {

    var wrapper = new dataWrapper();
    var map = new geoMap();
    var markerLayers = new markers();
    //var coder = new geoCoder();

    map.setHeight();
    var mapStart = map.init();
    var markerLayersStart = markerLayers.init(mapStart);
    //var geoStart = geo.init();
   
    // on submit
    $('#geocode').submit(function(event) {
        wrapper.clear();
        markerLayersStart.clearLayers();
        setupGeoCoder();
        return false;
    });

    // on keypress of enter
    $('#address').keypress(function(e) {
        if (e.which == 13) {
            wrapper.clear();
            markerLayersStart.clearLayers();
            setupGeoCoder();
            return false;
        }
    });

    // TODO: handle file uploads
    $('#batch').click(function() {
        return false;
    });

    // show/hide the data
    // allows user to get the data panel out of the way
     $('.show-hide-data').click(function() {
        wrapper.showHide();
    });

});