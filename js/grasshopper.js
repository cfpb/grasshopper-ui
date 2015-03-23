$(function() {
    var markerCount = 0,
        wrapper = new dataWrapper(),
        coder = new geocoder();
    
    // set map size
    $('#map, .panel').height(($(document).height() - $('header').height() - 21) + 'px');
    $('#map').width($(document).width() - $('.panel').width());

    // load base and settings
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
    var map = L.mapbox.map('map', 'cfpb.k55b27gd', { zoomControl: false, attributionControl: false })
        .setView([39.8282, -98.5795], 4);
    
    //new L.Control.Attribution({ position: 'bottomleft' }).addTo(map);
    var attribution = L.control.attribution({ position: 'bottomleft' });
    attribution.setPrefix('');
    attribution.addAttribution('<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox © OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/map-feedback/#cfpb.k55b27gd/-98.579/39.828/4" target="_blank">Improve this map</a>');
    attribution.addTo(map);
    map.scrollWheelZoom.disable();
    new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);

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

        //console.log('the count padding is : ' + $('#count').css('paddingTop') + ' and ' + $('#count').css('paddingTop'));
        //console.log('the geocode padding is : ' + $('#geocode').css('paddingTop') + ' and ' + $('#geocode').css('paddingTop'));
        //console.log('the downloads padding is : ' + $('#downloads').css('paddingTop') + ' and ' + $('#downloads').css('paddingTop'));
        //console.log('the panel padding is : ' + $('.panel').css('paddingTop') + ' and ' + $('.panel').css('paddingTop'));
        var padding = 0;
        $('.js-padded').each(function(i, obj) {
            //console.log($(this).css('borderBottomWidth'));
            padding = padding + parseInt($(this).css('paddingTop').replace("px", "")) + parseInt($(this).css('paddingBottom').replace("px", ""));
            padding = padding + parseInt($(this).css('borderTopWidth').replace("px", "")) + parseInt($(this).css('borderBottomWidth').replace("px", ""));
        });
        //console.log('the padding is : ' + padding);
        $('#data').height(($('.panel').height() - padding - $('#geocode').height() - $('#downloads').height() - $('#count').height()) + 'px');
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
              if (feature.geometry.type === 'Point') {
                  if(feature.id === linkID) {
                      marker.setIcon(L.divIcon({
                        className: 'marker-hover',
                        iconSize: [5, 5]
                      }));
                  }
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
            if (feature.geometry.type === 'Point') {
              // change the marker back to normal if its not active
              if(feature.id === linkID && !hasClass) {
                console.log('not active');
                    marker.setIcon(L.divIcon({
                      className: 'marker',
                      iconSize: [5, 5]
                    }));
                }
            }
        });
        return false;
     });

    // pan to the point from the panel
    // .on is used because the element being clicked is added to the DOM dynamically, by jQuery
    // change marker and result to active
    // reset everything else
    $('#data').on('click', '.lat-long', function() {

      wrapper.activeResult(this);
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