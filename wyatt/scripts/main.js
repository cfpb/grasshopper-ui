'use strict';
var loadLate = require('./loadLate');
var subAndRun = require('./subAndRun');
var mapboxQuery = require('./mapboxQuery');

var lateLoader = loadLate();
var subHub = subAndRun();

var d = document;
var container = d.getElementById('container');
var mapDiv = d.getElementById('mapDiv');
var queryForm = d.getElementById('queryForm');
var inp = d.getElementById('inp');

var firstLoad = 1;
var firstResult;

inp.focus();
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

subHub.setPreprocessor(getResult);
subHub.subscribe(function(result){console.log(result)});
subHub.subscribe(setFirstResult);
subHub.subscribe(buildResult);

function getResult(raw){
  return {
    addr : raw.features[0].place,
    coords : flipCoords(raw.features[0].center)
  }; 
}

function setFirstResult(result){
  firstResult = result;
  subHub.unsubscribe(setFirstResult);
}

function buildResult(result){
  var coords = result.coords;
  var addr = result.addr;
  var div = d.createElement('div');

}

function loadMap(){
  var mapboxCSS='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.css';
  var mapboxJS ='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.js';
  var loadCount=0;
  
  container.style.opacity = 1;
  queryForm.className += ' mapForm';

  lateLoader.css(mapboxCSS,initWhenLoaded);
  lateLoader.js(mapboxJS,initWhenLoaded);

  function initWhenLoaded(){
    if(++loadCount === 2) initMap();
  } 
}


function initMap(){
  var L = window.L;
  L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
  var map = window.map = L.mapbox.map(mapDiv, 'mapbox.streets', {zoomControl: false}).setView([38, -122], 10);
  new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
  var features = L.mapbox.featureLayer(null).addTo(map);
  
  if(firstResult) panToMarker(firstResult);
  subHub.subscribe(panToMarker);

  function panToMarker(result){
    features.setGeoJSON(result);
    map.panTo(flipCoords(result.features[0].geometry.coordinates));
  }

  
}


function flipCoords(arr){
  return [arr[1], arr[0]];
}


function process(err, result){
  if(err) console.error(err);
  var json = JSON.parse(result);
  subHub.run(json);
}






