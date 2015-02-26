'use strict';
var fn = function(){};
var listenerStore = [];

function add(div, result){

  function bound(){
    fn(result);
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
