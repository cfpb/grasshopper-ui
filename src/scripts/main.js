'use strict';

var loadLate = require('./loadLate');
var subAndRun = require('./subAndRun');
var mapboxQuery = require('./mapboxQuery');

var subHub = subAndRun();

var mapboxJS ='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.js';
var mapboxCSS='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.css';


function initMap(){
  var L = window.L;
  var mapDiv = document.getElementById('map');
  L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
  var map = L.mapbox.map(mapDiv, 'mapbox.streets').setView([38, -122], 10);
  var features = L.mapbox.featureLayer(null).addTo(map);
  mapDiv.style.opacity=1;
}


function flipCoords(arr){
  return [arr[1],arr[0]];
}


function process(err, result){
  if(err){
    console.error(err);
  }
  var json = JSON.parse(result);
  subHub.run(json);
}


subHub.subscribe(function(result){
  console.log(result);
});

subHub.subscribe(function(result){
  features.setGeoJSON(result);
  map.panTo(flipCoords(result.coordinates));
});


var firstLoad = 1;
var inp = document.getElementById('inp');
inp.addEventListener('keydown',function(e){
  if(e.keyCode === 13){

    if(firstLoad){
      initMap();
      firstLoad=0;
    }

    var query = mapboxQuery(this.value);
    this.value = '';
    grass.geocode(query, process);
  }
});


