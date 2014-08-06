function load_json(url,arg){
    $.getJSON(url,function( json ){
        parse(json,display_list_warning,arg);
    });
}

function parse(json,callback,arg){
    var data;
    if(json instanceof String || typeof(json) == "string"){
        data = $.parseJSON(json); 
    }
    else{
        data = json;
    }
    var sensors = data.sensors;
    callback(sensors,arg);
}

function display_list_warning(sensors,kind_warning){
    $("#list-alertes").append("<ul id='ul-alertes'></ul>");
    var ul = $("#ul-alertes");
    var size = 0;
    var number_security = 0;
    var number_energy = 0;
    for(i=0;i<sensors.length;i++){
        var sensor = sensors[i];
        var kind = sensor.kind;
        var salle = sensor.salle;
        var bat = sensor.bat;
        if(kind == "light" || kind == "temp")number_energy++;
        if(kind == "door" || kind == "window")number_security++;
        if(kind_warning == "security" && (kind == "door" || kind == "window")){
            $(ul).append("<li class='list-group-item'>"+bat+" "+salle+" ("+kind+")</li>");
            size++;
        }
        else if(kind_warning == "energy" && (kind == "light" || kind == "temp")){
            $(ul).append("<li class='list-group-item'>"+bat+" "+salle+" ("+kind+")</li>");
            size++;
        }
    }
    $("#title-alerte").append(" <span class=\"badge badge-error\">"+size+"</span>");
    $("#title-alerte-security").append(" <span class=\"badge badge-error\">"+number_security+"</span>");
    $("#title-alerte-energy").append(" <span class=\"badge badge-error\">"+number_energy+"</span>");
}