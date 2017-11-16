$(function () {
    var maps = $('div.map-container');

    maps.each(function () {
        var mapContainer = $(this);
        var mapArea = mapContainer.find('div.map-area');
        var attributes = mapContainer.data('json');
        var zoom = attributes.zoom;
        var size = attributes.size;
        var widthAndHeight = size.split('x');
        var mapCenter, markerCenter;
        var mapIsDynamic = attributes.map_type == 'dynamic';
        var map, mapMarker;


        mapArea.width(widthAndHeight[0]).height(widthAndHeight[1]);

        if (window.google && window.google.maps) {
            if (mapIsDynamic) {
                mapCenter = new google.maps.LatLng(attributes.latitude, attributes.longitude);
                markerCenter = new google.maps.LatLng(attributes.marker_latitude, attributes.marker_longitude);
            } else {
                mapCenter = markerCenter = new google.maps.LatLng(attributes.latitude, attributes.longitude);
                setTimeout(function () {
                    (new google.maps.Geocoder()).geocode({
                        address: attributes.full_address
                    }, function (results, status) {
                        mapCenter = (results[0].geometry.location);
                        map.setCenter(mapCenter);
                        mapMarker.setPosition(mapCenter);
                    });
                }, 500);
            }

            var mapOptions = {
                zoom: parseInt(zoom),
                center: mapCenter,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(mapArea[0], mapOptions);

            mapMarker = new google.maps.Marker({
                position: markerCenter,
                map: map,
                title: attributes.address_title,
                draggable: false
            });
        } else {
            if (mapIsDynamic) {
                mapCenter = attributes.latitude + ',' + attributes.longitude;
                markerCenter = attributes.marker_latitude + ',' + attributes.marker_longitude;
            } else {
                mapCenter = attributes.full_address;
                markerCenter = attributes.full_address;
            }

            var src = encodeURI('http://maps.googleapis.com/maps/api/staticmap?center=' + mapCenter + '&zoom=' + zoom +
                '&size=' + size + '&sensor=false&markers=' + markerCenter);
            $('<img src="' + src + '"/>').css('width', '100%').css('height', 'auto').
                appendTo(mapArea);
        }
    });
});
