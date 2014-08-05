google.maps.event.addDomListener(window, 'load', initialize);
insert_marker("temp1");

function insert_marker(bat_wanted){
    $.getJSON("../common-data/coord_poi.json", function( data ){
        var coords = data.coords;
        for(i=0;i<coords.length;i++){
            var bat = coords[i].bat;
            if(bat == bat_wanted){
                var latLng = new google.maps.LatLng(coords[i].lat,coords[i].lng);
                var marker = new google.maps.Marker({
                    position : latLng,
                    map:map,
                    name:bat,
                    animation:google.maps.Animation.BOUNCE
                });
                google.maps.event.addListener(marker,'click',function(event){
                    tooltip.setContent(bat_wanted+" est le bâtiment le moins occupé");
                    tooltip.open(map,this);
                    this.setAnimation(null);
                });
                break;
            }
        }
    });
}