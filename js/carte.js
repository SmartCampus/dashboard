$(document).ready(function($){
    
    $("#temp1").hide();
    $("#back-to-map-arrow").hide();
    
    /* Initialize the map (google) */
    function initialize() {
        /* Options de la map */
        var mapOptions = {
              center: new google.maps.LatLng(43.616156, 7.071433),
              zoom: 17
        };
         /* la map */
        var map = new google.maps.Map(document.getElementById("map_google"),mapOptions);
        
        var batiments = [];
        var bats = [];
        var infowindow = [
            new google.maps.InfoWindow({
                  content: "IUT"
              }),new google.maps.InfoWindow({
                  content: "Forum"
              }),new google.maps.InfoWindow({
                  content: "Templier 1"
              }),new google.maps.InfoWindow({
                  content: "Templier 2 (sud)"
              }),new google.maps.InfoWindow({
                  content: "Templier 2 (barette haute)"
              }),new google.maps.InfoWindow({
                  content: "Templier 2 (barrette basse)"
              })];
        $.getJSON("./data/coord_bat.json",function(data){
            
            var coords = data.values;
            for(i=0;i<coords.length;i++){
                bats[i] = coords[i].bat;
                var LatLngs = coords[i].coords;
                var mylats = [];
                for(k=0;k<LatLngs.length;k++){
                    mylats[k] = new google.maps.LatLng(LatLngs[k].lat,LatLngs[k].long)
                }
                batiments[i] = new google.maps.Polygon({
                    paths:mylats,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35                    
                });
                batiments[i].setMap(map);
                
                google.maps.event.addListener(batiments[i], 'click', function (event) {
                //display the polygon
                    display(this);
                });
                google.maps.event.addListener(batiments[i], 'mouseover', function(event) {
                    display_info_window(event.latLng,this);
                  });
                google.maps.event.addListener(batiments[i], 'mouseout', function(event) {
                    undisplay_info_window(this);
                  });
                function display_info_window(position,batiment){
                    var index = batiments.indexOf(batiment);
                    infowindow[index].setPosition(position);
                    infowindow[index].open(map);
                }
                function undisplay_info_window(batiment){
                    var index = batiments.indexOf(batiment);
                    infowindow[index].close(map);
                }
                /* Display building */
                function display(building){
                    
                    if(building != undefined){
                        var id = batiments.indexOf(building);
                        var bat = bats[id];
                        $('#map_google').hide(300);
                        $('#'+bat).show(300);
                        $('#back-to-map-arrow').show(300);
                    }
                }

                $("#back-to-map-arrow").click(function(){
                    $("#map_google").show(300);
                    $("#temp1").hide(300);
                    $("#back-to-map-arrow").hide(300);
                });
            }
        });
    }

    google.maps.event.addDomListener(window, 'load', initialize);
});