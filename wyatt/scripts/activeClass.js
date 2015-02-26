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
