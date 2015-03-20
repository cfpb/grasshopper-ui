var geoMap = function () {
    var mapID = 'map',
    h = $('header'),
    d = $(document);
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2ZwYiIsImEiOiJodmtiSk5zIn0.VkCynzmVYcLBxbyHzlvaQw';

    function setHeight () {
        $('#' + mapID).height((d.height() - h.height() - 40) + 'px');
        console.log((d.height() - h.height() - 40));
    }
    

    return {
        setHeight: setHeight,
        map: L.mapbox.map(mapID, 'cfpb.k55b27gd', { zoomControl: false }).setView([39.8282, -98.5795], 4)
    };

}
