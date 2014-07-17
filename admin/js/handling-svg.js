$(document).ready(function($){
    
    $("plan-security").ready(function(){
        load_svg("./data/plan_T1_4e.svg","plan-security",add_icon);
    });
    
    var svg;
    
    /**
     * Fonction qui charge le fichier svg
     * situé à l'adresse 'url' et qui dessine
     * l'image vectorielle dans la div dont
     * l'id est 'id'
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
    
    /**
     * Fonction qui ajoute un icone sur la salle
     * correspondant à l'id en paramètre
     */
    function add_icon(){
        $.getJSON( "./data/alertes.json", function( data ) {
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
                var id_salle = data.id_salle;
                var x,y,size_x,size_y;
                $(ul).append("<li class='list-group-item'>"+bat+" "+id_salle+" ("+kind+")</li>");
                var salle = $("#"+id_salle+">g").children().eq(0);
                var balise = salle.get(0).nodeName;
                // on affecte les valeurs de x et y selon la forme vectorielle de la salle

                if(balise == "rect"){    
                    size_x = parseFloat(salle.attr('width'));
                    size_y = parseFloat(salle.attr('height'));
                    x = parseFloat(salle.attr('x'));
                    y = parseFloat(salle.attr('y'));
                }
                else if(balise == "path"){
                    var points = (salle.attr("d")).split("-");
                    var coord = points[0].split(",");
                    // pour les portes
                    x = coord[0].substring(1);
                    y = coord[1].substring(0,coord[1].length-2);
                }
                else if(balise == "polygon"){
                    var points = (salle.attr("points")).split(" ");
                    var coord = points[0].split(",");
                    // pour les portes
                    x = coord[0];
                    y = coord[1];
                }
                // on corrige les valeurs de x et y selon le type de capteur
                var value_id = parseInt(id_salle.split("_")[1]);
                if(value_id < 24){
                    if(kind == "door"){
                        y = parseFloat(y) + size_y/2;
                    }
                }
                else if( value_id == 24){
                    if(kind == "door"){
                        x = parseFloat(x)-size_x;
                        y = parseFloat(y)+size_y/2;
                    }
                    else if(kind == "window"){
                        x = parseFloat(x)-size_x;
                    }
                    
                }
                else if(value_id < 30){
                    if(kind == "window"){
                        x = parseFloat(x)+size_x/2;
                    }
                }
                else if(value_id < 52){
                    if(kind == "window"){
                        y = parseFloat(y)+size_y/2;
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
                else if(value_id >= 63){
                    if(kind == "window"){
                        x = parseFloat(x) - size_x/2;
                    }
                    else if(kind == "door"){
                        x = parseFloat(x) - size_x;
                        y = parseFloat(y) + size_y*2;
                    }
                }

                // TODO (3)virer le polygon et gerer position des fenetres + (4)gerer mouseover + ..... mouais
                var existing_img = $("#img-"+kind+id_salle);
                if(existing_img.get(0) == undefined){
                     svg.append("image")
                            .attr("xlink:href","./data/img/"+kind+".png")
                            .attr('width', 20)
                            .attr('id', 'img-'+kind+id_salle)
                            .attr('height', 24)
                            .attr('x', x)
                            .attr('y', y)
                            .attr('title','capteur '+id_capteur);
                    // info bulles
                    $("#img-"+kind+id_salle).mouseover(function(){
                    if($(this).attr("title") == "")return false;
                    $('body').append("<span class=\"infobulle\"></span>");
                        var bulle = $(".infobulle:last");
                        bulle.append($(this).attr('title'));
                        var posTop = $(this).offset().top-bulle.height();
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
                    $("#img-"+kind+id_salle).mouseout(function(){
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
                    var img = d3.select('#img-'+kind+id_salle);
                    var title = img.attr('title');
                    img.attr('title',title+'<br/>capteur '+id_capteur);                    
                }
                
            }
            
        });
    }
    
    
});