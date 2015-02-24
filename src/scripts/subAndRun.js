module.exports = function(){
  'use strict';
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

  function run(data){ 
    for(var i=0; i<subscribers.length; i++){
      subscribers[i](data);
    }
  }
   
  return {
    run:run,
    subscribe:subscribe,
    unsubscribe:unsubscribe
  };
};
