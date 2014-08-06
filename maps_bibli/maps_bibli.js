/* Variables globales */
//la map google
var map;
//le layer gmaps représentant une heatmap
var heatmap;
var json_markers = [];
var hashmap_marker = new Object();
var tooltip = new google.maps.InfoWindow();


function load_and_launch(url_json,callback_handle,callback_do,kind){
    $.getJSON( url_json, function( data ){
        var sensors = data.sensors;
        for(k=0;k<kind.length;k++){
            callback_handle(sensors,kind[k],callback_do);
        }
    });
}



/* Initialize the map (google) */
function initialize() {
    
    /* Options de la map */
    var mapOptions = {
        /* coordonnées du centre du campus */
        center: new google.maps.LatLng(43.615796, 7.071655),
        zoom: 17,
        disableDefaultUI : true
    };
     /* la map */
    map = new google.maps.Map(document.getElementById("maps-div"),mapOptions);
    
    // liste des objets polygons de gmaps representant les batiments
    var batiments = [];
    // liste des coordonnees gmaps des batiments
    var bats = [];
    // on met les batiments sur la map
    put_bats(map,"../common-data/coord_bat.json",bats,batiments);
}

/**
 * Fonction qui initialise tous les
 * markers (objets gmaps) correspondant
 * aux centres des bâtiments
 * @param callback_load la fonction callback de chargement du fichier json
 * @param callback_handle la fonction qui traite les données
 * @param callback_do la fonction callback qui execute les données
 * @param url l'url du json à charger
 * @param args un tableau d'arguements
 */
function insert_all_marker(callback_load,callback_handle,callback_do,url,args){
    $.getJSON("../common-data/coord_poi.json", function( data ){
        var coords = data.coords;
        for(i=0;i<coords.length;i++){
            var bat = coords[i].bat;
            if(hashmap_marker[bat] == undefined){
                var latLng = new google.maps.LatLng(coords[i].lat,coords[i].lng);
                var marker = new google.maps.Marker({
                    position : latLng,
                    map:map,
                    animation: google.maps.Animation.DROP,
                    name:bat
                });
                hashmap_marker[bat] = marker;
                hashmap_marker[bat].setMap(null);
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
/**
 * Fonction qui ajoute les infos
 * sur une type de capteur
 * @param bat_wanted le batiment sur lequel l'info est mise a jour
 * @param kind le type de capteur concerné
 * @param number le nombre de capteur du type kind
 */
function add_info_marker(bat_wanted,kind,number){
    tooltip.close();
    var marker = hashmap_marker[bat_wanted];
    marker.animation = google.maps.Animation.DROP;
    var element_to_insert = $('#hidden_info_'+bat_wanted).children()[0];
    $(element_to_insert).append("<div class='"+kind+"'><img class='legende' alt='img' src='img/"+kind+".png'/><span>"+number+"</span> capteur(s) "+kind+"</div>");
    marker.setMap(map);
}

/**
 * Fonction qui supprime les infos
 * sur un type de capteur
 * @param bat_wanted le bâtiment sur le lequel l'info est mise a jour
 * @param kind le type de capteur concerné
 */
function remove_info_marker(bat_wanted,kind){
    tooltip.close();
    var marker = hashmap_marker[bat_wanted];
    marker.animation = google.maps.Animation.DROP;
    $('#hidden_info_'+bat_wanted+">a>."+kind).remove();
    var left_infos = check_left_info("hidden_info_"+bat_wanted+">a");
    if(left_infos>0)marker.setMap(map);
    else marker.setMap(null);
}

/**
* Fonction qui renvoi le nombre
* d'info restants affiché
* @param id l'id correspondant à l'élément html où sont stockées les infos
* @return le nombre d'éléments html dans l'élément id
*/
function check_left_info(id){
    var element = $("#"+id);
    return element.children().length;
}


/**
 * Function which handle data and launch
 * the good callback function with good parameters
 * @param sensors json data
 * @param kind_wanted the kind of data which will be displayed
 * @param callback the callback function
 */
function handle_marker(sensors,kind_wanted,callback){
    var number_sensors = new Object();
    var list_bat = [];
    var kind_found = false;
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
        if(kind == kind_wanted) kind_found = true;
        var n = number_sensors[bat+'_'+kind];
        if (n == undefined){
            number_sensors[bat+'_'+kind] = 0;
        }
        else{
            number_sensors[bat+'_'+kind]++;
        }
    }
    if(kind_found){
        for(i=0;i<list_bat.length;i++){
            callback(list_bat[i],kind_wanted,number_sensors[list_bat[i]+'_'+kind_wanted]);
        }
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
/**
 * Fonction qui charge des données depuis
 * un fichier JSON
 * @param url l'adresse du fichier json
 * @param callback la fonction a appeler apres chargement
 * @param kind le parametre de la fonction callback
 */
function load_data_heatmap(url,callback,kind){
    $.getJSON(url,function( data ){
        var coords = data.coords;
        callback(coords,kind);
    });
}

/** Fonction qui affiche une carte de chaleur
 * grâce à la lib intégrée de gmaps
 * @param un json contenant les coordonnées des points et leur pondération
 * @param kind_wanted le type de heatmap que l'on souhaite afficher (le type de capteur pris en compte)
 */
function display_heatmap(coords,kind_wanted){
    var data_heatmap = [];
    for(i=0;i<coords.length;i++){
        var kind = coords[i].kind;
        if(kind == kind_wanted){
            var values = coords[i].values;
            for(j=0;j<values.length;j++){
                var latLng = values[j];
                data_heatmap[j] = {location:new google.maps.LatLng(latLng.lat,latLng.lng),weight:latLng.count};
            }
            break;
        }                
    }
    var pointArray = new google.maps.MVCArray(data_heatmap);

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: data_heatmap
    });
    heatmap.set("maxIntensity",35);
    heatmap.setMap(map);
    
}
