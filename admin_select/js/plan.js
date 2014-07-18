$(document).ready(function($){
    
    /* #########################################
    #####                                   ####
    #####       Partie checkbox             ####
    #####                                   ####
    ############################################
    */
    /* Select All */
    $("#checkbox_all").click(function(){
        var checked = $(this).prop('checked');
        $('.my_checkbox').each(function(){
            if(checked){
                this.checked = true;
                $("."+$(this).attr('id').split('_')[1]).show();
            }
            else{
                this.checked = false;
                $("."+$(this).attr('id').split('_')[1]).hide();
            }
        });
    });
    
    function uncheck_all_box(box){
        if(!box.prop("checked")){
            $("#checkbox_all").attr("checked",false);
        }
    }
    
    /* Capteurs défectueux */
    $("#checkbox_bad").change(function(){
        uncheck_all_box($(this));
    });
    //TODO
    /* Carte de chaleur */
    $("#checkbox_heat").change(function(){
        uncheck_all_box($(this));
    });
    //TODO
    /* Fenêtres */
    $("#checkbox_window").change(function(){
        uncheck_all_box($(this));
    });
    //TODO
    /* Lumières */
    $("#checkbox_light").change(function(){
        uncheck_all_box($(this));
    });
    //TODO
    /* Portes */
    $("#checkbox_door").change(function(){
        uncheck_all_box($(this));
        if($(this).prop("checked")){
            $(".door").show();
        }
        else{
            $(".door").hide();
        }            
    });
    //TODO
    /* Présence */
    $("#checkbox_motion").change(function(){
        uncheck_all_box($(this));
    });
    //TODO
    /* Température */
    $("#checkbox_temp").change(function(){
        uncheck_all_box($(this));
    });
    //TODO
    
    /* #########################################
    #####                                   ####
    #####            Partie svg             ####
    #####                                   ####
    ############################################
    */
    
    
    function load_svg(url,id,callback){
        
        /*#############################################################
        ###   Declarer/creer la balise svg pour le dessin vectoriel ###
        ###############################################################*/
        svg = d3.select('body').select('#'+id).append('svg').attr('width',900).attr('height',450);



        /*#############################################################
        ###   Chargement du plan (format svg) et insertion          ###
        ###    dans la balise svg prealablement cree                ### 
        ###############################################################*/
        d3.xml(url,"image/svg+xml",function(xml){
            // on recupere le node 'svg' du xml recupere
            var svgNode = xml.getElementsByTagName("svg")[0];

            // on recupere la liste des elements du svg
            var childs = svgNode.childNodes;
             // pour chaque node, on l'insere dans le svg existant
            for(var i=1;i<childs.length;i++){
                svg.node().appendChild(childs[i]);
            }
            callback();
        });
        
    }
    
    function put_sensors_on_map(){
        $.getJSON( "data/sensors.json", function( data ) {
            var list_sensors = data.sensors;
            for(i=0;i<list_sensors.length;i++){
                var kind = list_sensors[i].kind;
                var bat = list_sensors[i].bat;
                var status = list_sensors[i].value;
                var salle = list_sensors[i].salle;
                var salle_svg = $("#"+salle+">g").children().eq(0);
                var balise = salle_svg.get(0).nodeName;              
                var x,y,size_x,size_y;
                // on affecte les valeurs de x et y selon la forme vectorielle de la salle

                if(balise == "rect"){    
                    size_x = parseFloat(salle_svg.attr('width'));
                    size_y = parseFloat(salle_svg.attr('height'));
                    x = parseFloat(salle_svg.attr('x'));
                    y = parseFloat(salle_svg.attr('y'));
                }
                else if(balise == "path"){
                    var points = (salle_svg.attr("d")).split("-");
                    var coord = points[0].split(",");
                    // pour les portes
                    x = coord[0].substring(1);
                    y = coord[1].substring(0,coord[1].length-2);
                }
                else if(balise == "polygon"){
                    var points = (salle_svg.attr("points")).split(" ");
                    var coord = points[0].split(",");
                    // pour les portes
                    x = coord[0];
                    y = coord[1];
                }
                // on corrige les valeurs de x et y selon le type de capteur
                var value_id = parseInt(salle.split("_")[1]);
                if(value_id == 12){
                    if(kind == "door"){
                        x = parseFloat(x) - size_x;
                        y = parseFloat(y) + size_y/2;
                    }
                }
                else if(value_id == 13){
                    if(kind == "door"){
                        x = parseFloat(x) - size_x*3/4;
                        y = parseFloat(y) + size_y*3/4;
                    }
                }
                else if(value_id == 15){
                    if(kind == "door"){
                        x = parseFloat(x) - size_x/6;
                        y = parseFloat(y) + size_y*6/4;
                    }
                }
                else if(value_id < 24){
                    if(kind == "door"){
                        y = parseFloat(y) + size_y/2;
                    }
                }
                else if( value_id == 24){
                    if(kind == "door"){
                        x = parseFloat(x)-size_x*2;
                        y = parseFloat(y)+size_y/2;
                    }
                    else if(kind == "window"){
                        x = parseFloat(x)-size_x;
                    }
                    
                }
                else if(value_id < 29){
                    if(kind == "window"){
                        x = parseFloat(x)+size_x/2;
                    }
                }
                else if(value_id == 29){
                    if(kind == "door"){
                        x = parseFloat(x) - size_x;
                    }
                }
                else if(value_id == 36){
                    if(kind == "door"){
                        x = parseFloat(x)-size_x*5/4;
                        y = parseFloat(y)+size_y*3.5;
                    }
                }
                else if(value_id == 39){
                    if(kind == "door"){
                        x = parseFloat(x)-size_x*2/3;
                        y = parseFloat(y);
                    }
                }
                else if(value_id == 41){
                    if(kind == "door"){
                        x = parseFloat(x)-size_x*3/4;
                        y = parseFloat(y)-size_y/2;
                    }
                }
                else if(value_id < 51){
                    if(kind == "window"){
                        y = parseFloat(y)+size_y/2;
                    }
                }
                else if(value_id == 54){
                    if(kind == "door"){
                        y = parseFloat(y);
                        x = parseFloat(x)-size_x/2;
                    }
                }
                else if(value_id == 59){
                    if(kind == "door"){
                        y = parseFloat(y);
                        x = parseFloat(x)-size_x;
                    }
                }
                else if(value_id < 57){
                    if(kind == "door"){
                        x = parseFloat(x) + size_x/2;
                    }
                    
                }
                
                else if(value_id < 63){
                    if(kind == "window"){
                        x = parseFloat(x) + size_x/2
                    }
                }
                else if(value_id < 66){
                    if(kind == "window"){
                        x = parseFloat(x) - size_x/2;
                    }
                    else if(kind == "door"){
                        x = parseFloat(x)-size_x/2;
                        y = parseFloat(y);
                    }
                }
                
                /*
                 * On insère les bonnes images pour chaque capteur 
                 * ainsi que les events dynamiques qui vont bien
                 */
                var existing_img = $("#img-"+kind+salle);
                if(existing_img.get(0) == undefined){
                     svg.append("image")
                            .attr("xlink:href","./img/"+kind+"-"+status+".png")
                            .attr('width', 20)
                            .attr('id', 'img-'+kind+salle)
                            .attr('height', 24)
                            .attr('x', x)
                            .attr('y', y)
                            .attr('title','capteur '+kind+' | batiment '+bat+' | salle '+salle+' | status '+status)
                            .attr('class',kind);
                    // info bulles
                    $("#img-"+kind+salle).mouseover(function(){
                        if($(this).attr("title") == "")return false;
                        $('body').append("<span class=\"infobulle\"></span>");
                            var bulle = $(".infobulle:last");
                            bulle.append($(this).attr('title'));
                            var posTop = $(this).offset().top-bulle.height()*2;
                            var posLeft = $(this).offset().left;
                            bulle.css({
                                left : posLeft,
                                top : posTop-10,
                                opacity : 0
                            });
                            bulle.animate({
                                top : posTop,
                                opacity : 0.99
                            });
                    });
                    $("#img-"+kind+salle).mouseout(function(){
                        var bulle = $(".infobulle:last");
                        bulle.animate({
                            top : bulle.offset().top+10,
                            opacity : 0
                        },500,"linear", function(){
                            bulle.remove();
                        });
                    });
                }
                else{
                    var img = d3.select('#img-'+kind+salle);
                    var title = img.attr('title');
                    img.attr('title',title+'<br/>capteur '+kind+' | batiment '+bat+' | salle '+salle+' | status '+status);
                }
            }
            $("."+kind).hide();
        });
    }
    
    $("#plan-select").ready(function(){
        load_svg("data/plan_T1_4e.svg","plan-select",put_sensors_on_map);
    });
    
    
    
});