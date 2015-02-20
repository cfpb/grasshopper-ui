(function(L, grass){
'use strict';
L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';
var map = L.mapbox.map('map', 'mapbox.streets').setView([38, -122], 10);
var features = L.mapbox.featureLayer(null).addTo(map);
window.features = features;

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
    if(err) console.error(err);
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
});

var inp = document.getElementById('inp');
inp.addEventListener('keydown',function(e){
  if(e.keyCode === 13){
    var query = this.value;
    this.value = '';
    grass.geocode(query, handler.process);
  }
});


})(window.L, window.grass);



