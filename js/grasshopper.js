var $ = require('jquery');
require('mapbox.js');

var wrapper = require('../js/data-wrapper');
var wrap = wrapper();
var coder = require('../js/geocoder');

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

    // when a marker gets added set the custom icon
    // and add the result to the panel
    markerLayer.on('layeradd', function(e) {
        var marker = e.layer,
        feature = marker.feature;
        if (feature.geometry.type === 'Point') {
            // custom marker
            markerSetClass(marker, 'marker');
        }
        wrap.addResults(feature);

        markerCount ++;
    });

    function formSubmitted() {
        var response = coder($('#address').val());
        
        if (response === 404) {
            markerLayer.clearLayers();
            map.setView([39.8282, -98.5795], 4);
            //$('.data-wrapper').slideUp('slow');
            wrap.addError(response);
        } else {
            markerCount = 0;
            markerLayer.clearLayers();
            // add the layer
            markerLayer.setGeoJSON(response);

            setTimeout(function() {
                map.fitBounds(markerLayer.getBounds());
            }, 0);
        }
         $('.data-wrapper').slideDown('slow');
    }

    function markerSetClass (marker, className) {
        marker.setIcon(L.divIcon({
            className: className,
            iconSize: [5, 5]
        }));
    }

    // on submit
    $('#geocode').submit(function(event) {
        wrap.clear();
        formSubmitted();
        return false;
    });

    // on keypress of enter
    $('#address').keypress(function(e) {
        wrap.clear();
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

    // .on is used because the element being clicked is added to the DOM dynamically, by jQuery
    // change marker and result to active
    // reset everything else
    $('#data').on('click', '.lat-long', function() {
        wrap.activeResult(this);
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