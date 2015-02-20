'use strict';
L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
var map = L.mapbox.map('map', 'mapbox.streets').setView([38, -122], 10);
var features = L.mapbox.featureLayer(null).addTo(map);

function randomBayPoint(){
  var geo = {
    "type": "Point",
    "properties": {
      "name": "Random Point"
    }
  };
  var r1 = Math.random()/4;
  var r2 = Math.random()/4;

  geo.coordinates = [-122.12+r1, 37.87+r2];
  return JSON.stringify(geo);
}

function flipCoords(arr){
  return [arr[1],arr[0]];
}

var handler = function(){
  var subscribers = [];
  
  function subscribe(fn){
    return subscribers.push(fn);
  } 

  function unsubscribe(fn){
    for(var i=0; i<subscribers.length; i++){
      if(subscribers[i] === fn){
        return subscribers.splice(i,1);
      }
    }
  }

  function process(err, result){
    if(err){
      result = randomBayPoint(); 
    }
    var json = JSON.parse(result);
    for(var i=0; i<subscribers.length; i++){
      subscribers[i](json);
    }
  }
   
  return {
    process:process,
    subscribe:subscribe,
    unsubscribe:unsubscribe
  };
}();

handler.subscribe(function(result){
  console.log(result);
})
handler.subscribe(function(result){
  features.setGeoJSON(result);
  map.panTo(flipCoords(result.coordinates));
});

var inp = document.getElementById('inp');
inp.addEventListener('keydown',function(e){
  if(e.keyCode === 13){
    var query = this.value;
    this.value = '';
    grass.geocode(query, handler.process);
  }
});


