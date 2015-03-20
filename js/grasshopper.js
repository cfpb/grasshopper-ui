$(function() {
    var markerCount = 0,
        wrapper = new dataWrapper(),
        coder = new geocoder();
    
    // set map size
    $('#map, .panel').height(($(document).height() - $('header').height() - 21) + 'px');
    $('#map').width($(document).width() - $('.panel').width());

    // load base and settings
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
    var map = L.mapbox.map('map', 'cfpb.k55b27gd', { zoomControl: false })
        .setView([39.8282, -98.5795], 4);
    new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
    new L.Control.Attribution({ position: 'bottomleft' }).addTo(map);
    map.scrollWheelZoom.disable();

    // add markerLayer to map
    var markerLayer = L.mapbox.featureLayer().addTo(map);

    // when a marker gets added
    markerLayer.on('layeradd', function(e) {
        var marker = e.layer,
        feature = marker.feature;
        // var wrapper = new dataWrapper();
        if (feature.geometry.type === 'Point') {
            // custom marker
            marker.setIcon(L.divIcon({
              className: 'marker',
              iconSize: [5, 5]
            }));
        }
        wrapper.addResults(feature);

        markerCount ++;
    });

    function formSubmitted(numQueries) {
        markerCount = 0;
        wrapper.clear();
        markerLayer.clearLayers();
        var updatedData = coder.setupGeoCoder();
        // add the layer
        markerLayer.setGeoJSON(updatedData);
        // fit the map to the bounds of the markers
        map.fitBounds(markerLayer.getBounds());
        //wrapper.showHide();

        $('.data-wrapper').slideDown('slow');

        wrapper.addCount(markerCount, numQueries);

        $('#data').height(($('.panel').height() - 82 - $('#geocode').height() - $('#downloads').height() - $('#count').height()) + 'px');
    }
   
    // on submit
    $('#geocode').submit(function(event) {
        formSubmitted(1);
        return false;
    });

    // on keypress of enter
    $('#address').keypress(function(e) {
        if (e.which == 13) {
            formSubmitted($('#address').val().split(';').length);
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

    // pan to the point from the panel
    // .on is used because the element being clicked is added to the DOM dynamically, by jQuery
    $('#data').on('click', '.lat-long', function() {

        wrapper.activeResult(this);
       //$('.result').removeClass('active');
       //$(this).closest($('.result')).addClass('active');
       
       // pan to
       map.panTo($(this).data('lat-long'));
       var linkID = $(this).data('id');

       // change marker
       markerLayer.eachLayer(function(marker) {
           var feature = marker.feature;
           if (feature.geometry.type === 'Point') {
               if(feature.id === linkID) {
                   marker.setIcon(L.divIcon({
                     className: 'marker-active',
                     iconSize: [5, 5]
                   }));
               } else {
                   marker.setIcon(L.divIcon({
                     className: 'marker',
                     iconSize: [5, 5]
                   }));
               }
           }
       });
       return false;
    });

});