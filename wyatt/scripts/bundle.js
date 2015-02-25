(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(){
  'use strict';
  var d = document;
  //Beware; appendChild doesn't work in all cases in ie6.
  var attachPoint = d.getElementsByTagName('script')[0].parentNode;

  function js(url, cb){
    var script = d.createElement('script'); 
    script.src = url;
    if(cb){
      script.onload = cb;
    }
    return attachPoint.appendChild(script);
  }

  function css(url, cb){
    var link = d.createElement('link');
    var img = d.createElement('img');
    link.rel = 'stylesheet';
    link.href = url;
    img.src = url;

    img.onerror = function(e){
      e.preventDefault();
      if(cb){
        cb(link);
      }
    };
    return attachPoint.appendChild(link);
  }

  return {
   css:css,
   js:js
  };

};

},{}],2:[function(require,module,exports){
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

subHub.subscribe(setFirstResult);
subHub.subscribe(function(result){console.log(result)});

function setFirstResult(result){
  firstResult = result;
  subHub.unsubscribe(setFirstResult);
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
  var zero = arr[0];
  arr[0] = arr[1];
  arr[1] = zero;
  return arr;
}


function process(err, result){
  if(err) console.error(err);
  var json = JSON.parse(result);
  subHub.run(json);
}







},{"./loadLate":1,"./mapboxQuery":3,"./subAndRun":4}],3:[function(require,module,exports){
var prefix = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/';
var suffix = '.json?access_token=pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';

module.exports = function(addr){
  return prefix + encodeURIComponent(addr) + suffix;   
}

},{}],4:[function(require,module,exports){
module.exports = function(){
  'use strict';
  var subscribers = [];

  
  function subscribe(fn){
    return subscribers.push(fn);
  } 

  function unsubscribe(fn){
    for(var i=0; i<subscribers.length; i++){
      if(subscribers[i] === fn){
        return subscribers.splice(i,1,empty);
      }
    }
  }

  function run(data){ 
    for(var i=0; i<subscribers.length; i++){
      subscribers[i](data);
    }
    cleanSubscribers();
  }


  //Empty splicing and cleaning subscribers done so subscribers can remove themselves
  //Could have required setTimeout(fn,0), but this is nicer
  function empty(){}

  function cleanSubscribers(){
    for(var i=0; i<subscribers.length; i++){
      if(subscribers[i] === empty){
        return subscribers.splice(i,1);
      }
    }
  }
   
  return {
    run:run,
    subscribe:subscribe,
    unsubscribe:unsubscribe
  };
};

},{}]},{},[2]);
