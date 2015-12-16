var $ = require('jquery');
require('mapbox.js');

var results = require('../js/results');

var geocoder = require('../js/geocoder');

$(function() {
    // setup map and markerLayer
    var headerPadTop = $('.header').css('padding-top').replace('px', '');
    var headerPadBottom = $('.header').css('padding-bottom').replace('px', '');
    var headerBorderBottom = $('.header').css('border-bottom-width').replace('px', '');
    $('#map').height(($(document).height() - $('.header').height() - headerPadTop - headerPadBottom - headerBorderBottom) + 'px');

    L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
    var map = L.mapbox.map('map', 'cfpb.k55b27gd', { zoomControl: false })
        .setView([39.8282, -98.5795], 4);
    map.scrollWheelZoom.disable();
    new L.Control.Zoom({ position: 'topright' }).addTo(map);

    var markerLayer = L.mapbox.featureLayer().addTo(map);

    function markerSetClass (marker, className) {
        marker.setIcon(L.divIcon({
            className: className,
            iconSize: [5, 5]
        }));
    }

    markerLayer.on('layeradd', function(e) {
        var marker = e.layer,
        feature = marker.feature;
        if (feature.geometry.type === 'Point') {
            markerSetClass(marker, 'marker');
        }
        feature.properties.id = String(Math.random()).replace('.', '');
        results.add(feature);
    });

    // form submission
    function displayResults(data) {
      if (data.status === 404) {
        results.error('404 - geocoder not found');
        markerLayer.clearLayers();
        map.setView([39.8282, -98.5795], 4);
      } else if (data.statusText === 'error') {
        results.error('Sorry, something went wrong');
        markerLayer.clearLayers();
        map.setView([39.8282, -98.5795], 4);
      } else {
        if (data.features.length === 0) {
          results.error('No results found');
          markerLayer.clearLayers();
          map.setView([39.8282, -98.5795], 4);
        } else {
          //var features = props.setProps(data);
          markerLayer.clearLayers();
          markerLayer.setGeoJSON(data.features);
          map.fitBounds(markerLayer.getBounds());
        }
      }
    }

    function formSubmitted() {
        results.clear();
        geocoder.single($('#address').val(), displayResults);
        results.show();
    }

    $('#geocode').submit(function(event) {
        formSubmitted();
        return false;
    });

    $('#address').keypress(function(e) {
        if (e.which == 13) {
            formSubmitted();
            return false;
        }
    });

    // marker animation

    $('#data').on('mouseover', '.lat-long', function() {
        if ($(this).closest($('.result')).hasClass('active')) {
            return false;
        } else {
            var linkID = $(this).data('id');
            markerLayer.eachLayer(function(marker) {
                var feature = marker.feature;
                if(feature.properties.id === linkID) {
                    markerSetClass(marker, 'marker-hover');
                }
            });
        }
    });

    $('#data').on('mouseout', '.lat-long', function() {
        var linkID = $(this).data('id');
        var hasClass = $(this).closest($('.result')).hasClass('active');
        markerLayer.eachLayer(function(marker) {
            var feature = marker.feature;
            if(feature.properties.id === linkID && !hasClass) {
                markerSetClass(marker, 'marker');
            }
        });
    });

    $('#data').on('click', '.lat-long', function() {
        results.active(this);
        var linkID = $(this).data('id');
        map.panTo($(this).data('lat-long'));
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
