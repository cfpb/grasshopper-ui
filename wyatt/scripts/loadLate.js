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
