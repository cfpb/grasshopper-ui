$(function() {
    function clearResults() {
        console.log('clearing results');
        // clear featureLayer
        markerLayer.clearLayers();
        // clear previous results
        $('.data-wrapper').slideDown('slow');
        //$('#data').css('display', 'none');
        //$('#count').css('display', 'none');
        $('#data').html('');
        $('#count').html('');
        $('.show-hide-data').text('Hide Data');
        // reset counts
        markerCount = 0;
        queryCount = 1;
    }

    

    /*
    the setup
    - set map (the div) height
    - create the map and set properties
    - add feature layer for markers
    - function for when layer is added
    */

    /*
    the start
    when form is submitted (button click or enter press)
    */

    // on submit
    $('#geocode').submit(function(event) {
        clearResults();
        setupGeoCoder();
        return false;
    });

    // on keypress of enter
    $('#address').keypress(function(e) {
        if (e.which == 13) {
            clearResults();
            setupGeoCoder();
            return false;
        }
    });

    /*
    A few extra jQuery functions
    - file upload
    - show/hide data
    - panTo
    */

    // TODO: handle file uploads
    $('#batch').click(function() {
        return false;
    });

    // show/hide the data
    // allows user to get the data panel out of the way
     $('.show-hide-data').click(function() {
        if ($('.data-wrapper').is(':hidden')) {
            $('.data-wrapper').slideDown('slow');
            $('.show-hide-data').text('Hide Data');
        } else {
            $('.data-wrapper').slideUp('slow');
            $('.show-hide-data').text('Show Data');
        }
    });

     // pan to the point from the panel
     // .on is used because the element being clicked is added to the DOM dynamically, by jQuery
     $('#data').on('click', '.lat-long', function() {

        $('.result').removeClass('active');
        $(this).closest($('.result')).addClass('active');
        //$(this).parent().parent().addClass('active');
        /*var currentPos = $(this).parent().parent().offset();
        $(this).parent().parent().offset({
            top: currentPos.top,
            left: currentPos.left + 20
        });*/
        // pan to
        map.panTo($(this).data('lat-long'));
        var linkID = $(this).data('id');

        // change marker
        markerLayer.eachLayer(function(marker) {
            var feature = marker.feature;
            if (feature.geometry.type === 'Point') {
                if(feature.id === linkID) {
                    marker.setIcon(L.divIcon({
                      className: 'marker-active',
                      iconSize: [5, 5]
                    }));
                } else {
                    marker.setIcon(L.divIcon({
                      className: 'marker',
                      iconSize: [5, 5]
                    }));
                }
            }
        });
        return false;
     });

});