module.exports = function(){
  'use strict';
  var d = document;
  //Beware; appendChild doesn't work in all cases in ie6.
  var attachPoint = d.getElementsByTagName('script')[0].parentNode;

  function script(url){
    var s = d.createElement('script'); 
    s.src = url;
    return attachPoint.appendChild(s);
  }

  function css(url){
    var l = d.createElement('link');
    l.ref = 'stylesheet';
    l.href = url;
    return attachPoint.appendChild(l);
  }

  return {
   css:css,
   script:script
  };

};
