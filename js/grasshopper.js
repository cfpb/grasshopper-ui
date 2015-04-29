var $ = require('jquery');
var wrapper = require('../js/data-wrapper');
var coder = require('../js/geocoder');
require('mapbox.js');

var wrap = wrapper();

$(function() {
    var markerCount = 0;
    
    
    // set map size
    var headerPadTop = $('.header').css('padding-top').replace('px', '');
    var headerPadBottom = $('.header').css('padding-bottom').replace('px', '');
    var headerBorderBottom = $('.header').css('border-bottom-width').replace('px', '');
    
    $('#map').height(($(document).height() - $('.header').height() - headerPadTop - headerPadBottom - headerBorderBottom) + 'px');

    // load base and settings
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
    var map = L.mapbox.map('map', 'cfpb.k55b27gd', { zoomControl: false, attributionControl:false })
        .setView([39.8282, -98.5795], 4);
    map.scrollWheelZoom.disable();
    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

    // add markerLayer to map
    var markerLayer = L.mapbox.featureLayer().addTo(map);

    // when a marker gets added set the custom icon
    // and add the result to the panel
    markerLayer.on('layeradd', function(e) {
        var marker = e.layer,
        feature = marker.feature;
        if (feature.geometry.type === 'Point') {
            // custom marker
            marker.setIcon(L.divIcon({
                className: 'marker',
                iconSize: [5, 5]
            }));
        }
        wrap.addResults(feature);

        markerCount ++;
    });

    function formSubmitted(numQueries) {
        markerCount = 0;
        //wrapper.clear();
        markerLayer.clearLayers();
        var updatedData = coder();
        console.log(updatedData);
        // add the layer
        markerLayer.setGeoJSON(updatedData[0]);
        // fit the map to the bounds of the markers
        map.fitBounds(markerLayer.getBounds());

        //$('.data-wrapper').slideDown('slow');

        wrap.addCount(markerCount, numQueries);
    }

    // on submit
    $('#geocode').submit(function(event) {
        console.log('submitted');
        formSubmitted(1);
        return false;
    });

    // on keypress of enter
    $('#address').keypress(function(e) {
        if (e.which == 13) {
            formSubmitted(1);
            return false;
        }
    });

    // show/hide the data
    // allows user to get the data panel out of the way
    $('.show-hide-data').click(function() {
        wrap.showHide();
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
                if(wrap.setID(feature) === linkID) {
                    marker.setIcon(L.divIcon({
                        className: 'marker-hover',
                        iconSize: [5, 5]
                    }));
                }
            });

            return false;
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
            if(wrap.setID(feature) === linkID && !hasClass) {
                marker.setIcon(L.divIcon({
                    className: 'marker',
                    iconSize: [5, 5]
                }));
            }
        });
        
        return false;
    });

    // pan to the point from the panel
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
            if(wrap.setID(feature) === linkID) {
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
        });
    
        return false;
    });

});