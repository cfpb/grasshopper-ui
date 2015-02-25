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
