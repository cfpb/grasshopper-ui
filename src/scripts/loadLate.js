module.exports = function(){
  'use strict';
  var d = document;
  //Beware; appendChild doesn't work in all cases in ie6.
  var attachPoint = d.getElementsByTagName('script')[0].parentNode;

  function script(url, cb){
    var s = d.createElement('script'); 
    s.src = url;
    if(cb) s.onload = cb;
    return attachPoint.appendChild(s);
  }

  function css(url, cb){
    var l = d.createElement('link');
    var img = d.createElement('img');
    l.ref = 'stylesheet';
    l.href = url;
    img.src = url;

    img.onerror = function(e){
      e.preventDefault();
      if(cb) cb(l);
    };
    return attachPoint.appendChild(l);
  }

  return {
   css:css,
   script:script
  };

};
