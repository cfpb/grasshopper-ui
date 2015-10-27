var $ = require('jquery');
require('mapbox.js');

var results = require('../js/results');
var result = results();

var props = require('../js/set-props');

var geocoder = require('../js/geocoder');

$(function() {
    // set map size
    var headerPadTop = $('.header').css('padding-top').replace('px', '');
    var headerPadBottom = $('.header').css('padding-bottom').replace('px', '');
    var headerBorderBottom = $('.header').css('border-bottom-width').replace('px', '');
    $('#map').height(($(document).height() - $('.header').height() - headerPadTop - headerPadBottom - headerBorderBottom) + 'px');

    // load map base and settings
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
    var map = L.mapbox.map('map', 'cfpb.k55b27gd', { zoomControl: false })
        .setView([39.8282, -98.5795], 4);
    map.scrollWheelZoom.disable();
    new L.Control.Zoom({ position: 'topright' }).addTo(map);

    // add markerLayer to map
    var markerLayer = L.mapbox.featureLayer().addTo(map);

    function markerSetClass (marker, className) {
        marker.setIcon(L.divIcon({
            className: className,
            iconSize: [5, 5]
        }));
    }

    // when a marker gets added set the custom icon
    // and add the result to the panel
    markerLayer.on('layeradd', function(e) {
        var marker = e.layer,
        feature = marker.feature;
        if (feature.geometry.type === 'Point') {
            markerSetClass(marker, 'marker');
        }
        result.add(feature);

        markerCount ++;
    });

    function displayResults(data) {
        if (data.status === 404) {
            result.error('404 - geocoder not found');
            markerLayer.clearLayers();
            map.setView([39.8282, -98.5795], 4);
        } else {
            if (data.addressPointsService.status === 'ADDRESS_NOT_FOUND' && data.censusService.status === 'ADDRESS_NOT_FOUND') {
               result.error('No results found');
               markerLayer.clearLayers();
               map.setView([39.8282, -98.5795], 4);
            } else {
                var features = props.setProps(data);

                markerCount = 0;
                markerLayer.clearLayers();
                // add the layer
                // panel gets updated on markerLayer.on above
                markerLayer.setGeoJSON(features);

                setTimeout(function() {
                    map.fitBounds(markerLayer.getBounds());
                }, 0);
            }
        }
    }

    function formSubmitted() {
        result.clear();
        geocoder.single($('#address').val(), displayResults);
        result.show();
    }

    // on submit
    $('#geocode').submit(function(event) {
        formSubmitted();
        return false;
    });

    // on keypress of enter
    $('#address').keypress(function(e) {
        if (e.which == 13) {
            formSubmitted();
            return false;
        }
    });

     // on mouseover of link
     $('#data').on('mouseover', '.lat-long', function() {
        // if its acitve do nothing
        if ($(this).closest($('.result')).hasClass('active')) {
            return false;
        // else blink marker and symbol with gold color (marker-hover class)
        } else {
            var linkID = $(this).data('id');

              // change marker
            markerLayer.eachLayer(function(marker) {
                var feature = marker.feature;
                if(feature.properties.id === linkID) {
                    markerSetClass(marker, 'marker-hover');
                }
            });
        }
    });

    // .on is used because the element being clicked is added to the DOM dynamically, by jQuery
    // on mouse out
    $('#data').on('mouseout', '.lat-long', function() {
        var linkID = $(this).data('id');
        var hasClass = $(this).closest($('.result')).hasClass('active');
        // change marker
        markerLayer.eachLayer(function(marker) {
            var feature = marker.feature;
            // change the marker back to normal if its not active
            if(feature.properties.id === linkID && !hasClass) {
                markerSetClass(marker, 'marker');
            }
        });
    });
    
    // change marker and result to active
    // reset everything else
    $('#data').on('click', '.lat-long', function() {
        result.active(this);
        var linkID = $(this).data('id');
        map.panTo($(this).data('lat-long'));
        // change marker
        markerLayer.eachLayer(function(marker) {
            var feature = marker.feature;
            if(feature.properties.id === linkID) {
                markerSetClass(marker, 'marker-active');
            } else {
                markerSetClass(marker, 'marker');
            }
        });
    
        return false;
    });

});