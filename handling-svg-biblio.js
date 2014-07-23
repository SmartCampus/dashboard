/* ##############################################################################
   ##############################################################################
   #########                                                            #########
   #########        Bibliotèque permettant d'afficher un                #########
   #########        fichier svg et d'y insérer des éléments             #########
   #########        (JQuery et D3.js sont nécessaires pour son          #########
   #########        bon fonctionnement ainsi que le fichier             #########
   #########        handling-svg-biblio.css)                            #########
   #########                                                            #########
   ##############################################################################
   ##############################################################################*/

/*
 * Fonction qui génère une infobulle 
 * pour l'élément html ayant l'id mis en 
 * paramètre et ayant un title
 * Ce title sera le texte affiché par l'infobulle
 * @param id l'id de l'élément à afficher l'infobulle
 */
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

/*
 * Fonction qui charge un ficher svg
 * et l'insère dans une code html
 * @param url l'url du fichier svg à charger
 * @param id l'id de la balise ou sera inséré le svg
 * @param url_json l'url du fichier json à utiliser pour la fonction callback
 * @param callback la fonction callback
 */
function load_svg(url,id,url_json,callback){
    /* Declarer/creer la balise svg pour le dessin vectoriel */
    svg = d3.select('body').select('#'+id).append('svg').attr('width',750).attr('height',350);
    
    /* Chargement du plan (format svg) et insertion
     * dans la balise svg prealablement cree
     */
    d3.xml(url,"image/svg+xml",function(xml){
        // on recupere le node 'svg' du xml recupere
        var svgNode = xml.getElementsByTagName("svg")[0];
        // on recupere la liste des elements du svg
        var childs = svgNode.childNodes;
         // pour chaque node, on l'insere dans le svg existant
        for(var i=1;i<childs.length;i++){
            svg.node().appendChild(childs[i]);
        }
        if(callback != undefined && url_json != undefined)callback(url_json);
    });
}

/*
 * Fonction qui supprime tous
 * les capteurs de type kind sur 
 * le plan svg
 */
function unput_sensors(kind,url_json){
    $.getJSON( url_json, function( data ) {
        var sensors = data.sensors;
        for(i=0;i<sensors.length;i++){
            var salle = sensors[i].salle;
            function room_is_full(){
                var array_icons = $("#"+salle+">g>image");
                var n = 0;
                array_icons.each(function(){
                    n++;
                });
                if((n-1)>1) return true;
                return false;
            }
            d3.select('svg').selectAll("."+kind).remove();
            d3.select('svg').selectAll(".group").remove();
            if(room_is_full()){
                put_sensors("recreate");
            }
            else{
                $('.img-icons').show();
            }
        }
        relocate(url_json);
    });
}

/*
 * Fonction qui ajoute sur le plan svg
 * l'ensemble des capteurs de type kind
 * présent dans le json.
 * @param kind_wanted le type de capteur à ajouter sur le plan
 * @param url_json l'url du json contenant les informations sur les capteurs
 */
function put_sensors(kind_wanted,url_json){
    $.getJSON( url_json, function( data ) {
        var list_sensors = data.sensors;
        var svg_node = d3.select('body').select('svg');
        for(i=0;i<list_sensors.length;i++){
            var kind = list_sensors[i].kind;
            var bat = list_sensors[i].bat;
            var status = list_sensors[i].value;
            var salle = list_sensors[i].salle;
            var node_to_insert = d3.select('body').select('svg').select("#"+salle+">g");
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
            var n = 0;
            if(kind_wanted == "recreate"){
                insert_icon_group();
            }
            else if(kind == kind_wanted){
                if(room_is_full(salle)){
                    // trop de capteurs à afficher -> on regroupe
                    insert_icon(kind,status,salle,bat,x,y,node_to_insert);
                    insert_icon_group(kind,status,bat,salle,x,y,size_x,size_y,node_to_insert);
                }
                else{
                    insert_icon(kind,status,salle,bat,x,y,node_to_insert);
                }
            }
        }
        relocate(url_json);
    });
}
/* 
 * Fonction qui dit si
 * la salle a atteint le 
 * nombre maximum de capteurs
 * @param salle la salle à vérifier
 * @return true or false
 */
function room_is_full(salle){
    var array_icons = $("#"+salle+">g>image");
    n = 0;
    array_icons.each(function(){
        n++;
    });
    if(n>1) return true;
    return false;
}

/*
 * Fonction qui remplace l'ensemble des capteur
 * en les groupant sur un seul icone, affichant la liste de 
 * tous les capteurs dans tooltip, masque les autres capteurs
 * @param kind le type de capteur
 * @param status l'état du capteur
 * @param bat le batiment ou se situe la salle
 * @param salle l'id de la salle où se situe le capteur
 * @param x la position x de la salle
 * @param y la position y de la salle
 * @param size_x la largeur de la salle
 * @param size_y la hauteur de la salle
 * @param node_to_insert le noeud correspondant à la salle (svg)
 */
function insert_icon_group(kind,status,bat,salle,x,y,size_x,size_y,node_to_insert){
    var array_icons = $("#"+salle+">g>image");
    var title = "";
    /* on récupère les titles de tous les autres capteurs de la salle */
    array_icons.each(function(){
        title = title + $(this).eq(0).attr('title')+'<br/>';
        $(this).hide();
    });
    var existing_circle = $("#circle-"+salle);
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
                .attr('id', 'circle-'+salle)
                .attr('cx', x+size_x/2)
                .attr('cy', y+size_y/2)
                .attr('title',title)
                .attr('class','group')
                .style('stroke','black')
                .style('fill','blue')
                .style('fill-opacity',0.6);

        init_tooltip("#circle-"+salle);
    }
    else{
        var img = d3.select('#circle-'+salle);
        var title = img.attr('title');
        img.attr('title',title+'<br/>capteur '+kind+' | batiment '+bat+' | salle '+salle+' | status '+status);
    }
}

/*
 * Fonction qui insère les bonnes images pour chaque capteur 
 * @param kind le type de capteur à afficher
 * @param salle l'id de la salle dans lequel sera le capteur
 * @param status l'état du capteur
 * @param bat le batiment où se situe la salle
 * @param x la position x de la salle
 * @param y la position y de la salle
 * @param node_to_insert le noeud correspondant à la salle (svg)
 */
function insert_icon(kind,status,salle,bat,x,y,node_to_insert){

    var existing_img = $("#img-"+kind+salle);
    if(existing_img.get(0) == undefined){
         node_to_insert.append("image")
                .attr("xlink:href","./img/"+kind+"-"+status+".png")
                .attr('width', 20)
                .attr('id', 'img-'+kind+salle)
                .attr('height', 24)
                .attr('x', x)
                .attr('y', y)
                .attr('title','<img alt="img-capteur" src="./img/'+kind+"-"+status+'.png" style="width:20px"/>capteur '+kind+' | batiment '+bat+' | salle '+salle+' | status '+status)
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

/*
 * Repositionne deux capteur dans une salle
 * pour un meilleur affichage
 * @param url_json l'url du json contenant les info sur les capteurs
 */
function relocate(url_json){
    $.getJSON( url_json, function( data ) {
        var sensors = data.sensors;
        for(i=0;i<sensors.length;i++){
            var salle = sensors[i].salle;
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