'use strict';
var loadLate = require('./loadLate');
var subAndRun = require('./subAndRun');
var mapboxQuery = require('./mapboxQuery');
var eventManager = require('./eventManager');

var lateLoader = loadLate();
var subHub = subAndRun();

var d = document;
var container = d.getElementById('container');
var mapDiv = d.getElementById('mapDiv');
var resultPane = d.getElementById('resultPane');
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
  console.log(raw);
  var feature = raw.features[0];
  var addr = feature.place_name.replace(/, United States$/, '');
  var coords = flipCoords(feature.center);
  var geo = feature.geometry;
  
  //Override lines with their center
  geo.type = 'Point'; 
  geo.coordinates = feature.center;
  geo.properties = makeGeoProps(coords, addr);

  return {
    addr : addr,
    coords : coords,
    geo : geo   
  }; 
}


function setFirstResult(result){
  firstResult = result;
  subHub.unsubscribe(setFirstResult);
}


function makeGeoProps(coords, addr){
  return {
    title:coords[0].toFixed(3) + ', ' + coords[1].toFixed(3),
    description:addr
  };
}


function buildResult(result){
  var div = d.createElement('div');
  var h4 = d.createElement('h4');
  var span = d.createElement('span');
  div.className = 'result';

  eventManager.add(div, result);

  h4.innerText = result.geo.properties.title;
  span.innerText = result.geo.properties.description;

  div.appendChild(h4);
  div.appendChild(span);
  resultPane.appendChild(div);
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
  
  eventManager.setFn(panToMarker);

  if(firstResult) panToMarker(firstResult);

  subHub.subscribe(panToMarker);

  function panToMarker(result){
    features.setGeoJSON(result.geo);
    map.panTo(result.coords);
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






