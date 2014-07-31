function load_and_launch(url_json,callback_handle,callback_do,kind){
    $.getJSON( url_json, function( data ){
        var sensors = data.sensors;
        for(k=0;k<kind.length;k++){
            callback_handle(sensors,kind[k],callback_do);
        }
    });
}

var map;
var heatmap;
var json_markers = [];
var hashmap_marker = new Object();
var tooltip = new google.maps.InfoWindow();

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
}

function insert_all_marker(callback_load,callback_handle,callback_do,url,args){
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
                hashmap_marker[bat] = marker;
                $("body").append("<div id='hidden_info_"+bat+"' hidden><a href='"+bat+"-plan-"+$("#page_id").html()+".html'>"+bat+":</a><div>");
                google.maps.event.addListener(marker,'click',function(event){
                    tooltip.setContent($("#hidden_info_"+this.name).html());
                    tooltip.open(map,this);
                });
            }
        }
        if(callback_load != undefined){
            callback_load(url,callback_handle,callback_do,args);
        }
    });
}
function add_info_marker(bat_wanted,kind,number){
    tooltip.close();
    var marker = hashmap_marker[bat_wanted];
    $('#hidden_info_'+bat_wanted).append("<div class='"+kind+"'><img class='legende' alt='img' src='img/"+kind+".png'/><span>"+number+"</span> capteur "+kind+"</div>");
    marker.setMap(map);
}

function remove_info_marker(bat_wanted,kind){
    tooltip.close();
    var marker = hashmap_marker[bat_wanted];
    $('#hidden_info_'+bat_wanted+">."+kind).remove();
}

function handle_marker(sensors,kind_wanted,callback){
    var number_sensors = new Object();
    var list_bat = [];
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
        var n = number_sensors[bat+'_'+kind];
        if (n == undefined){
            number_sensors[bat+'_'+kind] = 0;
        }
        else{
            number_sensors[bat+'_'+kind]++;
        }
    }
    for(i=0;i<list_bat.length;i++){
        callback(list_bat[i],kind_wanted,number_sensors[list_bat[i]+'_'+kind_wanted]);
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

        }
    });
}
function display_info_window(position,batiment,batiments){
    var index = batiments.indexOf(batiment);
    infowindow[index].setPosition(position);
    infowindow[index].open(map);
}
function undisplay_info_window(batiment){
    var index = batiments.indexOf(batiment);
    infowindow[index].close(map);
}

function load_data_heatmap(url,callback,kind){
    $.getJSON(url,function( data ){
        var coords = data.coords;
        callback(coords,kind);
    });
}

function display_heatmap(coords,kind_wanted){
    var data_heatmap = [];
    for(i=0;i<coords.length;i++){
        var kind = coords[i].kind;
        if(kind == kind_wanted){
            var values = coords[i].values;
            for(j=0;j<values.length;j++){
                var latLng = values[j];
                data_heatmap[j] = new google.maps.LatLng(latLng.lat,latLng.lng);
            }
            break;
        }
                          
    }
    var pointArray = new google.maps.MVCArray(data_heatmap);

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray
    });

    heatmap.setMap(map);
}
