var geoMap = function () {
    var mapID = 'map',
    h = $('header'),
    d = $(document);

    function setHeight () {
        $('#' + mapID).height((d.height() - h.height() - 40) + 'px');
        console.log((d.height() - h.height() - 40));
    }
    function init () {
        L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
        var map = L.mapbox.map(mapID, 'cfpb.k55b27gd', { zoomControl: false })
            .setView([39.8282, -98.5795], 4);
        
        return map;
    }

    return {
        setHeight: setHeight,
        init: init
    };

}
/*
    the setup
    - set map (the div) height
    - create the map and set properties
    - add feature layer for markers
    - function for when layer is added
    */

// set map size
//$('#map').height(($(document).height() - $('header').height() - 40) + 'px');

// load base and settings
/*L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
var map = L.mapbox.map('map', 'cfpb.k55b27gd', { zoomControl: false })
    .setView([39.8282, -98.5795], 4);
new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
map.scrollWheelZoom.disable();*/

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