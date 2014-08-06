function display_list_warning(kind_warning){
    $.getJSON( "data/alertes.json", function( data ) {
       var sensors = data.sensors;
        $("#list-alertes").append("<ul id='ul-alertes'></ul>");
        var ul = $("#ul-alertes");
        var size = 0;
        for(i=0;i<sensors.length;i++){
            var sensor = sensors[i];
            var kind = sensor.kind;
            var salle = sensor.salle;
            var bat = sensor.bat;
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
    });
}

function display_alert_number(){
    $.getJSON("data/alertes.json",function( data ){
        var sensors = data.sensors;
        var number_security = 0;
        var number_energy = 0;
        for(var i=0;i<sensors.length;i++){
            var kind = sensors[i].kind;
            if(kind == "light" || kind == "temp")number_energy++;
            if(kind == "door" || kind == "window")number_security++;
        }
        $("#title-alerte-security").append(" <span class=\"badge badge-error\">"+number_security+"</span>");
        $("#title-alerte-energy").append(" <span class=\"badge badge-error\">"+number_energy+"</span>");
    });
    
}