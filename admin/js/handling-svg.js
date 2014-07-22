$(document).ready(function($){

    
    /* #########################################
    #####                                   ####
    #####            Partie svg             ####
    #####                                   ####
    ############################################
    */
    
    function load_svg(url,id,url_json,callback){
        
        /*#############################################################
        ###   Declarer/creer la balise svg pour le dessin vectoriel ###
        ###############################################################*/
        svg = d3.select('body').select('#'+id).append('svg').attr('width',750).attr('height',350);



        /*#############################################################
        ###   Chargement du plan (format svg) et insertion          ###
        ###    dans la balise svg prealablement cree                ### 
        ###############################################################*/
        d3.xml(url,"image/svg+xml",function(xml){
            console.log(xml);
            // on recupere le node 'svg' du xml recupere
            var svgNode = xml.getElementsByTagName("svg")[0];

            // on recupere la liste des elements du svg
            var childs = svgNode.childNodes;
             // pour chaque node, on l'insere dans le svg existant
            for(var i=1;i<childs.length;i++){
                svg.node().appendChild(childs[i]);
            }
            callback(url_json);
        });
        
    }
    
    
    function put_sensors(url){
        
        $.getJSON( url, function( data ) {
           var list_alertes = data.alertes;
            $("#list-alertes").append("<ul id='ul-alertes'></ul>");
            var ul = $("#ul-alertes");
            $("#title-alerte").append(" <span class=\"badge\">"+list_alertes.length+"</span>");
            var size_x,size_y;
            for(i=0;i<list_alertes.length;i++){
                var alertes = list_alertes[i];
                var id_capteur = alertes.id;
                var data = alertes.data;
                var kind = data.kind;
                var bat = data.bat;
                var salle = data.id_salle;
                var x,y,size_x,size_y;
                $(ul).append("<li class='list-group-item'>"+bat+" "+salle+" ("+kind+")</li>");
                var salle_svg = $("#"+salle+">g").children().eq(0);
                var node_to_insert = d3.select('body').select('svg').select("#"+salle+">g");
                var balise = salle_svg.get(0).nodeName;
                // on affecte les valeurs de x et y selon la forme vectorielle de la salle

                if(balise == "rect"){    
                    size_x = parseFloat(salle_svg.attr('width'));
                    size_y = parseFloat(salle_svg.attr('height'));
                    x = parseFloat(salle_svg.attr('x'));
                    y = parseFloat(salle_svg.attr('y'));
                }
                
                var n = 0;
                if(room_is_full()){
                    // trop de capteurs à afficher -> on regroupe
                    insert_icon();
                    insert_icon_group();
                }
                else{
                    insert_icon();
                }
                
                /* fonction qui dit si
                 * la salle a atteint le 
                 * nombre maximum de capteurs
                 */
                function room_is_full(){
                    var array_icons = $("#"+salle+">g>image");
                    n = 0;
                    array_icons.each(function(){
                        n++;
                    });
                    if(n>1) return true;
                    return false;
                }
                
                /*
                 * On remplace l'ensemble des capteur
                 * en les groupant sur un seul
                 * icone, affichant la liste de 
                 * tous les capteurs dans tooltip
                 * masque les autres capteurs
                 */
                function insert_icon_group(){
                    var array_icons = $("#"+salle+">g>image");
                    var title = "";
                    /* on récupère les titles de tous les autres capteurs de la salle */
                    array_icons.each(function(){
                        title = title + $(this).eq(0).attr('title')+'<br/>';
                        $(this).hide();
                    });
                    var existing_circle = $("#circle-"+kind+salle);
                    if(existing_circle.get(0) == undefined){
                        node_to_insert.append("text")
                                .attr('x', x+size_x/2-5)
                                .attr('y', y+size_y/2+5)
                                .attr('fill','black')
                                .text(n+1)
                                .attr('class','group')
                                .attr('title',title);
                         node_to_insert.append("circle")
                                .attr('r', 10)
                                .attr('id', 'circle-'+kind+salle)
                                .attr('cx', x+size_x/2)
                                .attr('cy', y+size_y/2)
                                .attr('title',title)
                                .attr('class','group')
                                .style('stroke','black')
                                .style('fill','blue')
                                .style('fill-opacity',0.6);
                        
                        init_tooltip("#circle-"+kind+salle);
                    }
                    else{
                        var img = d3.select('#circle-'+kind+salle);
                        var title = img.attr('title');
                        img.attr('title',title+'<br/>capteur '+kind+' | batiment '+bat+' | salle '+salle+' | status '+status);
                    }
                }
                
                
                /*
                 * On insère les bonnes images pour chaque capteur 
                 * ainsi que les events dynamiques qui vont bien
                 */
                function insert_icon(){
                    
                    var existing_img = $("#img-"+kind+salle);
                    if(existing_img.get(0) == undefined){
                         node_to_insert.append("image")
                                .attr("xlink:href","./img/"+kind+".png")
                                .attr('width', 20)
                                .attr('id', 'img-'+kind+salle)
                                .attr('height', 24)
                                .attr('x', x)
                                .attr('y', y)
                                .attr('title','<img alt="img-capteur" src="./img/'+kind+'.png" style="width:20px"/>capteur '+kind+' | batiment '+bat+' | salle '+salle+' | status '+status)
                                .attr('class',kind+' img-icons');
                        // info bulles
                        init_tooltip("#img-"+kind+salle);
                    }
                    else{
                        var img = d3.select('#img-'+kind+salle);
                        var title = img.attr('title');
                        img.attr('title',title+'<br/>capteur '+kind+' | batiment '+bat+' | salle '+salle+' | status '+status);
                    }
                    
                }
            }
            relocate(url);
        });
    }
    /*
     * Repositionne deux capteur dans une salle
     * pour un meilleur affichage
     */
    function relocate(url){
        $.getJSON( url, function( data ) {
           var list_alertes = data.alertes;
            var size_x,size_y;
            for(i=0;i<list_alertes.length;i++){
                var alertes = list_alertes[i];
                var data = alertes.data;
                var salle = data.id_salle;
                var x,y,size_x,size_y;
                var salle_svg = $("#"+salle+">g").children().eq(0);
                var balise = salle_svg.get(0).nodeName;
                // on affecte les valeurs de x et y selon la forme vectorielle de la salle
                var size = 0;
                var images = $("#"+salle+">g>image");
                images.each(function(){
                    size++;
                });
                if(size <= 2){
                    var my_salle = $("#"+salle+">g>rect");
                    var salle_id = parseInt(salle.split("_")[1]);
                    var x_base = parseFloat($(my_salle[0]).eq(0).attr('x'));
                    var y_base = parseFloat($(my_salle[0]).eq(0).attr('y'));
                    var x_size = parseFloat($(my_salle[0]).eq(0).attr('width'));
                    var y_size = parseFloat($(my_salle[0]).eq(0).attr('height'));
                    /* la position des capteurs dépend de la position de la salle sur le plan */
                    if((salle_id == 14) || (salle_id == 40) || (salle_id>23 && salle_id<29) || (salle_id>51)){
                        $(images[1]).eq(0).attr('x',x_base + x_size/2);
                        $(images[1]).eq(0).attr('y',y_base); 
                    }
                    else{
                        $(images[1]).eq(0).attr('x',x_base);
                        $(images[1]).eq(0).attr('y',y_base + y_size/2);                    
                    }
                    $(images[0]).eq(0).attr('x',x_base);
                    $(images[0]).eq(0).attr('y',y_base);
                    if(salle_id == 29 || salle_id == 39){
                        $(images[0]).eq(0).attr('x',x_base + x_size/3);
                        $(images[0]).eq(0).attr('y',y_base + y_size/3);
                        $(images[1]).eq(0).attr('x',x_base + x_size/2);
                        $(images[1]).eq(0).attr('y',y_base + y_size*2/3);
                    }
                    if(salle_id == 13){
                        $(images[1]).eq(0).attr('x',x_base + x_size/3);
                        $(images[1]).eq(0).attr('y',y_base + y_size/3);
                    }
                    if(salle_id == 54){
                        $(images[0]).eq(0).attr('x',x_base + x_size/4);
                    }
                }
                
            }
        });
    }
    
    /* Génère les infobulles pour les capteurs et les groupement de capteurs */
    function init_tooltip(id){
        $(id).mouseover(function(){
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
        $(id).mouseout(function(){
            var bulle = $(".infobulle:last");
            bulle.animate({
                top : bulle.offset().top+10,
                opacity : 0
            },500,"linear", function(){
                bulle.remove();
            });
        });
    }
    
    $("#plan-security").ready(function(){
        load_svg("data/plan_T1_4e.svg","plan-security","data/alertes-security.json",put_sensors);
    });
    
    
    
});