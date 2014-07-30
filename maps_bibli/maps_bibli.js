function load_and_launch(url_json,callback,arg){
    $.getJSON( url_json, function( data ){
        var sensors = data.sensors;
        if(arg != undefined){
            callback(sensors,arg);
        }
        else{
            callback(sensors);
        }
    });
}

var map;
var json_markers = [];
var hashmap_marker = new Object();
var tooltip = new google.maps.InfoWindow();
var hashmap_tooltip = new Object();

/* Initialize the map (google) */
function initialize() {
    
    /* Options de la map */
    var mapOptions = {
          center: new google.maps.LatLng(43.615796, 7.071655),
          zoom: 17
    };
     /* la map */
    map = new google.maps.Map(document.getElementById("maps-div"),mapOptions);

    var batiments = [];
    var bats = [];
   
    put_bats(map,"data/coord_bat.json",bats,batiments);
    insert_all_marker();
}

function put_marker(markers,kind_wanted){
    var list_markers = [];
    j=0;
    for(i=0;i<markers.length;i++){
        var data = markers[i];
        var kind = data.kind;
        if(kind == kind_wanted){
            var lat = data.lat;
            var lng = data.lng;
            var latLng = new google.maps.LatLng(lat,lng);
            var marker = new google.maps.Marker({
                position : latLng,
                map:map,
                icon : "img/"+kind+".png"
            });
            list_markers[j++] = marker;
        }
    }
    json_markers.push({
        kind : kind_wanted,
        markers : list_markers
        
    });
}

function unput_marker(markers,kind_wanted){
    for(var i=0;i<json_markers.length;i++){
        if(json_markers[i].kind == kind_wanted){
            var list_markers = json_markers[i].markers;
            for(var j=0;j<list_markers.length;j++){
                list_markers[j].setMap(null);
            }
        }
    }
    
}

function insert_all_marker(){
    $.getJSON("data/coord_poi.json", function( data ){
        var coords = data.coords;
        for(i=0;i<coords.length;i++){
            var bat = coords[i].bat;
            if(hashmap_marker[bat] == undefined){
                var latLng = new google.maps.LatLng(coords[i].lat,coords[i].lng);
                var marker = new google.maps.Marker({
                    position : latLng,
                    map:map,
                    name:bat
                });
                marker.setMap(null);
                hashmap_marker[bat] = marker;
                hashmap_tooltip[marker.name] = "<a href='"+bat+"-plan.html'>"+bat+":</a>";
                google.maps.event.addListener(marker,'click',function(event){
                    tooltip.setContent(hashmap_tooltip[this.name]);
                    tooltip.open(map,this);
                });
            }
        }
       
    });
}
function add_info_marker(bat_wanted,kind,number){
    tooltip.close();
    var marker = hashmap_marker[bat_wanted];
    hashmap_tooltip[bat_wanted]+= "<br/><div class='"+kind+"'><img class='legende' alt='img' src='img/"+kind+".png'/><span>"+number+"</span> capteur "+kind+"</div>";
    marker.setMap(map);
}

function handle_marker(sensors,kind_wanted){
    var number_sensors = new Object();
    var list_bat = [];
    //var list_kind = [];
    for(i=0;i<sensors.length;i++){
        var sensor = sensors[i];
        var bat = sensor.bat;
        var already = false;
        for(j=0;j<list_bat.length;j++){
            if(list_bat[j] == bat){
                already = true;
            }
        }
        if(!already)list_bat[list_bat.length] = bat;
        already = false;
        var kind = sensor.kind;
        /*for(j=0;j<list_kind.length;j++){
            if(list_kind[j] == kind){
                already = true;
            }
        }
        if(!already)list_kind[list_kind.length] = kind;*/
        var n = number_sensors[bat+'_'+kind];
        if (n == undefined){
            number_sensors[bat+'_'+kind] = 0;
        }
        else{
            number_sensors[bat+'_'+kind]++;
        }
    }
    for(i=0;i<list_bat.length;i++){
        add_info_marker(list_bat[i],kind_wanted,number_sensors[list_bat[i]+'_'+kind_wanted]);
    }
}



/* On récupère et parcours les coordonnées des batiments
pour construire les polygones correspondants 
(en ajoutant les events nécessaires)*/
function put_bats(map,url,bats,batiments){
    $.getJSON(url,function(data){

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
                strokeColor: "#428bca",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#428bca",
                fillOpacity: 0.35                    
            });
            /* on l'ajoute sur la map */
            batiments[i].setMap(map);

            /* on ajoute un listener pour le clic *
            google.maps.event.addListener(batiments[i], 'click', function (event) {
            //display the polygon
                display(this);
            });*
            
            google.maps.event.addListener(batiments[i], 'click', function(event) {
                display_info_window(event.latLng,this,batiments);
              });
            /*google.maps.event.addListener(batiments[i], 'mouseout', function(event) {
                undisplay_info_window(this);
              });*/

        }
    });
}
/*$("#temp1>img").click(function(event){
    var id = event.target.parentNode.id;
    $("#"+id).hide();
    $("#map_google").show();

});
$("#others>img").click(function(event){
    var id = event.target.parentNode.id;
    $("#"+id).hide();
    $("#map_google").show();

});*/
function display_info_window(position,batiment,batiments){
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
