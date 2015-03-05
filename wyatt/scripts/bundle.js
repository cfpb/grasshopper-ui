(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var lastTarget = null;
var className;
var classRegex;

function activeClass(target){
  if (target === lastTarget) return;
  var currClass = target.className;
  if(lastTarget){
    var lastClass = lastTarget.className;
    lastTarget.className = trim(lastClass.replace(classRegex, ' '));
  }
  target.className = trim(currClass + ' ' + className);
  lastTarget = target;
}

function trim(str){
  return str.replace(/^\s/,'').replace(/\s$/,'');
}

activeClass.set = function(newClassName){
  className = newClassName;
  classRegex = new RegExp('\s*'+className+'\s*');
};

module.exports = activeClass;

},{}],2:[function(require,module,exports){
'use strict';
var fn = function(){};
var listenerStore = [];

function add(div, result){

  function bound(){
    fn(div, result);
  }

  div.addEventListener('mousedown', bound);
  listenerStore.push({div:div,fn:bound});
}


function remove(div){
  for(var i=0; i<listenerStore.length; i++){
    if(div === listenerStore[i].div){
      div.removeEventListener(div, listenerStore[i].fn);
      return listenerStore.splice(i,1);
    }
  }
}


function setFn(newFn){
  fn = newFn;
}


module.exports = {
  add:add,
  remove:remove,
  setFn:setFn  
};

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';
var loadLate = require('./loadLate');
var subAndRun = require('./subAndRun');
var mapboxQuery = require('./mapboxQuery');
var eventManager = require('./eventManager');
var activeClass = require('./activeClass');

var lateLoader = loadLate();
var subHub = subAndRun();
activeClass.set('selectedResult');

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
  activeClass(div);

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
  
  eventManager.setFn(function(div, result){
    activeClass(div);
    panToMarker(result);
  });

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







},{"./activeClass":1,"./eventManager":2,"./loadLate":3,"./mapboxQuery":5,"./subAndRun":6}],5:[function(require,module,exports){
var prefix = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/';
var suffix = '.json?access_token=pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';

module.exports = function(addr){
  return prefix + encodeURIComponent(addr) + suffix;   
}

},{}],6:[function(require,module,exports){
module.exports = function(){
  'use strict';
  var subscribers = [];
  var preprocessor;

  
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
    if(preprocessor) data = preprocessor(data);
    for(var i=0; i<subscribers.length; i++){
      subscribers[i](data);
    }
    cleanSubscribers();
  }

  function setPreprocessor(fn){
    preprocessor = fn;
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
    unsubscribe:unsubscribe,
    setPreprocessor:setPreprocessor
  };
};

},{}]},{},[4]);
