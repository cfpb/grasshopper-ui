document.addEventListener('DOMContentLoaded',function(){
  'use strict';
  var L = window.L;
  L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
  var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([37.1, -127.58], 9);
  console.log(map);
});

