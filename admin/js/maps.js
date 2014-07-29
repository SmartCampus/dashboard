/* Initialize the map (google) */
function initialize() {
    
    

    /* Options de la map */
    var mapOptions = {
          center: new google.maps.LatLng(43.615796, 7.071655),
          zoom: 17
    };
     /* la map */
    var map = new google.maps.Map(document.getElementById("maps-div"),mapOptions);

    var batiments = [];
    var bats = [];
    /* Info bulle by maps */
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

    /* On récupère et parcours les coordonnées des batiments
        pour construire les polygones correspondants 
        (en ajoutant les events nécessaires)*/
    $.getJSON("data/coord_bat.json",function(data){

        var coords = data.values;
        for(i=0;i<coords.length;i++){
            var latLngMark;
            bats[i] = coords[i].bat;
            var LatLngs = coords[i].coords;
            /* on crée un path de coordonnées pour le polygone */
            var mylats = [];
            for(k=0;k<LatLngs.length;k++){
                mylats[k] = new google.maps.LatLng(LatLngs[k].lat,LatLngs[k].long)
            }
            latLngMark = mylats[0];
            /* on cree le batiment */
            batiments[i] = new google.maps.Polygon({
                paths:mylats,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35                    
            });
            /* on l'ajoute sur la map */
            batiments[i].setMap(map);

            /* on ajoute un listener pour le clic */
            google.maps.event.addListener(batiments[i], 'click', function (event) {
            //display the polygon
                display(this);
            });
            /*
            google.maps.event.addListener(batiments[i], 'mouseover', function(event) {
                display_info_window(event.latLng,this);
              });
            google.maps.event.addListener(batiments[i], 'mouseout', function(event) {
                undisplay_info_window(this);
              });*/
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
                    console.log(bat);
                    if(bat == "temp1"){
                        $('#map_google').hide();
                        $('#temp1').show();
                    }
                    else{
                        $('#map_google').hide();
                        $('#others').show();
                    }
                }
            }
            
            var marker = new google.maps.Marker({
                position : latLngMark,
                map:map,
                icon : 'img/door-false.png',
                animation : google.maps.Animation.DROP,
                title:infowindow[i].getContent()
            });
        }
    });


    $("#temp1>img").click(function(event){
        var id = event.target.parentNode.id;
        $("#"+id).hide();
        $("#map_google").show();

    });
    $("#others>img").click(function(event){
        var id = event.target.parentNode.id;
        $("#"+id).hide();
        $("#map_google").show();

    });
}

google.maps.event.addDomListener(window, 'load', initialize);