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
                  content: "Forum"
              }),new google.maps.InfoWindow({
                  content: "Templier 1"
              }),new google.maps.InfoWindow({
                  content: "Templier 2 Sud"
              }),new google.maps.InfoWindow({
                  content: "Templier 2 (barette haute)"
              }),new google.maps.InfoWindow({
                  content: "Templier 2 (barette basse)"
              }),new google.maps.InfoWindow({
                  content: "IUT"
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

        /*
        
        
        
        /*var marker = new google.maps.Marker({
      position: new google.maps.LatLng(43.616917, 7.073574),
      map: map,
            animation: google.maps.Animation.DROP,
      title: 'Hello World!'
  });*
        google.maps.event.addListener(forum, 'mouseover', function(event) {
                infowindow.setPosition(event.latLng);
                infowindow.open(map);
  });
       /* google.maps.event.addListener(forum, 'mouseout', function(event) {
            infowindow.close(map);
            bool = 1;
  });*/
    }

    


    google.maps.event.addDomListener(window, 'load', initialize);
});