'use strict';

var loadLate = require('./loadLate');
var subAndRun = require('./subAndRun');
var mapboxQuery = require('./mapboxQuery');

var lateLoader = loadLate();
var subHub = subAndRun();

var mapDiv = document.getElementById('map');
var inp = document.getElementById('inp');

var firstLoad = 1;


inp.addEventListener('keydown',function(e){
  if(e.keyCode === 13){

    if(firstLoad){
      loadMap();
      firstLoad=0;
    }

    var query = mapboxQuery(this.value);
    this.value = '';
    grass.geocode(query, process, {uri:1});
  }
});


subHub.subscribe(function(result){
  console.log(result);
});


function loadMap(){
  var mapboxCSS='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.css';
  var mapboxJS ='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.js';
  var loadCount=0;
  
  mapDiv.style.opacity = 1;

  lateLoader.css(mapboxCSS,initWhenLoaded);
  lateLoader.js(mapboxJS,initWhenLoaded);

  function initWhenLoaded(){
    if(++loadCount === 2) initMap();
  } 
}


function initMap(){
  var L = window.L;
  L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
  var map = L.mapbox.map(mapDiv, 'mapbox.streets', {zoomControl: false}).setView([38, -122], 10);
  new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
  var features = L.mapbox.featureLayer(null).addTo(map);

  subHub.subscribe(function(result){
  features.setGeoJSON(result);
  map.panTo(flipCoords(result.coordinates));
});
}


function flipCoords(arr){
  return [arr[1],arr[0]];
}


function process(err, result){
  if(err) console.error(err);
  var json = JSON.parse(result);
  subHub.run(json);
}






