var prefix = 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places/';
var suffix = '.json?access_token=pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';

module.exports = function(addr){
  return prefix + encodeURIComponent(addr) + suffix;   
}
