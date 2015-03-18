var markerCount = 0;
// set map size
$('#map').height(($(document).height() - $('header').height() - 40) + 'px');

// load base and settings
L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
var map = L.mapbox.map('map', 'cfpb.k55b27gd', { zoomControl: false })
    .setView([39.8282, -98.5795], 4);
new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
map.scrollWheelZoom.disable();