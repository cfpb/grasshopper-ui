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
