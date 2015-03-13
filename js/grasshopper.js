$(function() {
    var geocoder;
    var activeMarkerIcon = L.divIcon({
      className: 'active-marker',
      iconSize: [5, 5]
    });
    var markerCount = 0;
    var queryCount = 1;

    /*
    dealing with data
    - setting query name (friendly to read)
    - adding new properties to the feature
    - rendering results
    - clearing results
    - creating the geocoder
    */

    // return the query name from the result
    function setQueryName(location) {
        var queryName = '';
        $.each(location, function (i, namePart) {
            if (i === location.length - 1) {
                queryName = queryName + ', <span>' + namePart + '</span>';
            } else {
                queryName = queryName + namePart + ' ';
            }
            //console.log(queryName);
        });
        return queryName;
    }

    // we need to show a few things that aren't in the feature
    // the actual query ran and the attribution
    function setProperties(data) {
        // single address
        if (data.results.length === undefined) {
            console.log ('single');
            //data.results.features[0].properties.query = setQueryName(data.results.query);
            //data.results.features[0].properties.attribution = data.results.attribution;
            $.each(data.results.features, function(j, feature) {
                feature.properties.query = setQueryName(data.results.query);;
                feature.properties.attribution = data.results.attribution;
            });
        // batch
        } else {
            console.log ('batch');
            $.each(data.results, function(i, result) {
                $.each(result.features, function(j, feature) {
                    feature.properties.query = setQueryName(result.query);;
                    feature.properties.attribution = result.attribution;
                });
            });
        }
        return data;
    }

    function renderResults(err, data) {
        var updatedData = setProperties(data);
        
        // add the layer
        markerLayer.setGeoJSON(updatedData.results);
        // fit the map to the bounds of the markers
        map.fitBounds(markerLayer.getBounds());

        // append to count
        $('#count').append('Showing ' + markerCount + ' results based on ' + queryCount + ' queries');
        // show data
        //$('.data-wrapper').css('display', 'block');
        $('.data-wrapper').slideDown('slow');
        //$('#data').css('display', 'block');
        //$('#count').css('display', 'block');
        $('.show-hide-data').css('display', 'block');
    }

    function clearResults() {
        // clear featureLayer
        markerLayer.clearLayers();
        // clear previous results
        $('.data-wrapper').slideDown('slow');
        //$('#data').css('display', 'none');
        //$('#count').css('display', 'none');
        $('#data').html('');
        $('#count').html('');
        $('.show-hide-data').text('Hide Data');
        // reset counts
        markerCount = 0;
        queryCount = 1;
    }

    function setupGeoCoder() {
        // if there is no ; its a single address
        if ($('#address').val().indexOf(';') === -1) {
            var geocoder = L.mapbox.geocoder('mapbox.places');
            geocoder.query($('#address').val(), renderResults);
        // else batch
        } else {
            queryCount = $('#address').val().split(';').length;
            var geocoder = L.mapbox.geocoder('mapbox.places-permanent');
            geocoder.query($('#address').val() , renderResults);
        }
    }

    /*
    the setup
    - set map (the div) height
    - create the map and set properties
    - add feature layer for markers
    - function for when layer is added
    */

    // set map size
    $('#map').height(($(document).height() - $('header').height() - 40) + 'px');

    // load base and settings
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
    var map = L.mapbox.map('map', 'cfpb.k55b27gd', { zoomControl: false })
        .setView([39.8282, -98.5795], 4);
    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
    map.scrollWheelZoom.disable();

    // featureLayer for markers and add it to the map
    var markerLayer = L.mapbox.featureLayer().addTo(map);

    // when a layer is added
    markerLayer.on('layeradd', function(e) {
        var marker = e.layer,
        feature = marker.feature;
        var geoType = '';

        // if it's a point
        if (feature.geometry.type === 'Point') {
            // custom marker
            marker.setIcon(L.divIcon({
              className: 'marker',
              iconSize: [5, 5]
            }));

            geoType = '<div class="point geo-symbol"></div>';
        } else if (feature.geometry.type === 'LineString') {
            geoType = '<div class="line geo-symbol"></div>';
        } else if (feature.geometry.type === 'MultiLineString') {
            geoType = '<div class="line geo-symbol"></div><div class="line geo-symbol"></div>';
        }

            var colorClass = 'good';
            if (feature.relevance < .75 && feature.relevance > .5) {
                colorClass = 'ok';
            } else if (feature.relevance <= .5) {
                colorClass = 'bad';
            }
            
            // append the data
            $('#data').append('<div class="result group">'
                + '<div class="geo-data">'
                + '<h5><a class="lat-long" data-id="' + feature.id + '" data-lat-long="[' + feature.center[1] + ', ' + feature.center[0] + ']" href="#">'
                + feature.center[1] + ', ' + feature.center[0]
                + '</a> ' + geoType + '</h5>'
                + '<p class="placename">' + feature.place_name + '</p>'
                + '<p class="type">' + feature.geometry.type + '</p>'
                + '<p class="relevance ' + colorClass + '">Score: ' + feature.relevance + '</p>'
                + '<p class="source">' + feature.properties.attribution + '</p>'
                + '</div>'
                + '<h6>' + feature.properties.query + '</h6>'
                + '</div>');

            markerCount ++;
       // }
    });

    /*
    the start
    when form is submitted (button click or enter press)
    */

    // on submit
    $('#geocode').submit(function(event) {
        clearResults();
        setupGeoCoder();
        return false;
    });

    // on keypress of enter
    $('#address').keypress(function(e) {
        if (e.which == 13) {
            clearResults();
            setupGeoCoder();
            return false;
        }
    });

    /*
    A few extra jQuery functions
    - file upload
    - show/hide data
    - panTo
    */

    // TODO: handle file uploads
    $('#batch').click(function() {
        return false;
    });

    // show/hide the data
    // allows user to get the data panel out of the way
     $('.show-hide-data').click(function() {
        if ($('.data-wrapper').is(':hidden')) {
            $('.data-wrapper').slideDown('slow');
            $('.show-hide-data').text('Hide Data');
        } else {
            $('.data-wrapper').slideUp('slow');
            $('.show-hide-data').text('Show Data');
        }
        /*$('.data-wrapper').toggle( "slow", function() {
            if ($('.data-wrapper').css('display') === 'none') {
                $('.show-hide-data').text('Show Data');
            } else {
                $('.show-hide-data').text('Hide Data');
            }
        });*/
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