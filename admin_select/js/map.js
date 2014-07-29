$(document).ready(function($){
    $("#form_radio").hide();
    /*
     * Active ou désactive l'affichage par
     * carte de chaleur
     */
    $("#myonoffswitch").click(function(){
        var checked = $(this).prop("checked");
        if(checked){
            $('#checkbox_all').prop("checked",false);
            $('.my_checkbox').each(function(){
                var kind = $(this).attr('id').split('_')[1];
                this.checked = false; 
                $('.my_radio').each(function(){
                    this.checked = false;
                });
            });
        }
        $('.choice').each(function(){
            var id = $(this).attr('id');
            var parent = $(this).parent();
            if(checked){
                $("#form_radio").show();
                $("#form_check").hide();
            }
            else{
                $("#form_radio").hide();
                $("#form_check").show();

            }
        });
    });
    
    /* affiche/enlève les capteurs correspondant
     * à la checkbox cochée/décochée
     */
    $('.my_checkbox').change(function(){
        var kind = $(this).attr('id').split('_')[1];
        //uncheck_all_box($(this));
        if($(this).prop("checked")){
            load_and_launch("data/markers.json",put_marker,kind);
        }
        else{
            load_and_launch("data/sensors.json",unput_marker,kind);
        }
        
    });
});

function load_and_launch(url_json,callback,arg){
    $.getJSON( url_json, function( data ){
        var markers = data.markers;
        if(arg != undefined){
            callback(markers,arg);
        }
        else{
            callback(markers);
        }
    });
}
 /* Info bulle by maps */
var infowindow = [
        new google.maps.InfoWindow({
              content: "IUT"
          }),new google.maps.InfoWindow({
              content: "Forum"
          }),new google.maps.InfoWindow({
              content: "<a href='select-plan.html'>Templier 1</a>"
          }),new google.maps.InfoWindow({
              content: "Templier 2 (sud)"
          }),new google.maps.InfoWindow({
              content: "Templier 2 (barette haute)"
          }),new google.maps.InfoWindow({
              content: "Templier 2 (barrette basse)"
          })];
var map;
var json_markers = [];

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
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35                    
            });
            /* on l'ajoute sur la map */
            batiments[i].setMap(map);

            /* on ajoute un listener pour le clic *
            google.maps.event.addListener(batiments[i], 'click', function (event) {
            //display the polygon
                display(this);
            });*/
            
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
