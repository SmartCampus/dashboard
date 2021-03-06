// set this variable to load poi on the good building
batWanted = 'temp1';

google.maps.event.addDomListener(window, 'load', initialize_one);

/* Function which insert a google
 * maps marker on a google maps
 * The coordinates of the poi are in '../common-data/coord_poi.json'
 * @param bat_wanted the building where the marker will be put
 */
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