function load_json_menu(url,arg){
    $.getJSON(url,function( data ){
        return parse_and_get_menu(data,arg);
    });
}

function parse_and_get_menu(json,arg){
    var data;
    if(json instanceof String || typeof(json) == "string"){
        data = $.parseJSON(json); 
    }
    else{
        data = json;
    }
    return get_menu(data,arg);
}

function get_menu(json,date_wanted){
    menus = json.menus;
    var menu_of_the_day = [];
    for(var i=0 ; i<menus.length ; i++){
        var date = menus[i].date;
        if(date == date_wanted){
            menu_of_the_day[0] = menus[i].entree;
            menu_of_the_day[1] = menus[i].plat;
            menu_of_the_day[2] = menus[i].dessert;
            display_menu(menu_of_the_day);
            break;
        }
    }
}

function display_menu(menu){
    $("#entree").html(menu[0]);
    $("#plat").html(menu[1]);
    $("#dessert").html(menu[2]);
}
