$(function() {
    //console.log('main loaded');
    //var geocoder;
    var queryCount = 1;

    function renderResults(data) {
        console.log('rendering results');
        var updatedData = setProperties(data);
        
        // add the layer
        markerLayer.setGeoJSON(updatedData);
        // fit the map to the bounds of the markers
        map.fitBounds(markerLayer.getBounds());

        // append to count
        $('#count').append('Showing ' + markerCount + ' results based on ' + queryCount + ' queries');
        
        //wrapper.showHide();
        //$('#data').css('display', 'block');
        //$('#count').css('display', 'block');
        $('.show-hide-data').css('display', 'block');
    }

    function setupGeoCoder() {
        //console.log('geocoding');
        var apiPre = 'http://api.tiles.mapbox.com/v4/geocode/';
        var apiSuf = '.json?access_token=pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
        // if there is no ; its a single address
        if ($('#address').val().indexOf(';') === -1) {
            console.log('one address');
            var geocoder = 'mapbox.places';
            //http://api.tiles.mapbox.com/v4/geocode/{index}/{query}.json?access_token=<your access token>
            //geocoder.query($('#address').val(), renderResults);
        // else batch
        } else {
            queryCount = $('#address').val().split(';').length;
            var geocoder = 'mapbox.places-permanent';
            //http://api.tiles.mapbox.com/v4/geocode/{index}/{query};{query}; ... ;{query}.json?access_token=<your access token>
            //geocoder.query($('#address').val() , renderResults);
        }
        /*$.get(apiPre + geocoder + '/' + $('#address').val() + apiSuf, function(data) {
            console.log('data= ');
            console.log(data);
        });*/
        $.ajax({
            url: apiPre + geocoder + '/' + $('#address').val() + apiSuf,
            method: "GET",
            //data: { id : menuId },
            dataType: "json"
        }).done(function(data) {
            console.log(data);
            renderResults(data);
        });
        //renderResults(data);
    }

    var markerCount = 0;
    var wrapper = new dataWrapper();
    
    // set map size
    $('#map').height(($(document).height() - $('header').height() - 40) + 'px');

    // load base and settings
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
    var map = L.mapbox.map('map', 'cfpb.k55b27gd', { zoomControl: false })
        .setView([39.8282, -98.5795], 4);
    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
    map.scrollWheelZoom.disable();

    var markerLayer = L.mapbox.featureLayer().addTo(map);

    markerLayer.on('layeradd', function(e) {
        var marker = e.layer,
        feature = marker.feature;
        //var geoType = '';
        var wrapper = new dataWrapper();
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
   
    // on submit
    $('#geocode').submit(function(event) {
        wrapper.clear();
        markerLayer.clearLayers();
        setupGeoCoder();
        return false;
    });

    // on keypress of enter
    $('#address').keypress(function(e) {
        if (e.which == 13) {
            wrapper.clear();
            markerLayer.clearLayers();
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

    // pan to the point from the panel
    // .on is used because the element being clicked is added to the DOM dynamically, by jQuery
    $('#data').on('click', '.lat-long', function() {

       $('.result').removeClass('active');
       $(this).closest($('.result')).addClass('active');
       //$(this).parent().parent().addClass('active');
       /*var currentPos = $(this).parent().parent().offset();
       $(this).parent().parent().offset({
           top: currentPos.top,
           left: currentPos.left + 20
       });*/
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