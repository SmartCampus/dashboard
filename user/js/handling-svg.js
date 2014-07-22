//TODO generer JSON pour les salles + tooltip pour salles et non les icones + lien vers maps
/* #########################################
#####                                   ####
#####            Partie svg             ####
#####                                   ####
############################################
*/


function load_svg(url,id){

    /*#############################################################
    ###   Declarer/creer la balise svg pour le dessin vectoriel ###
    ###############################################################*/
    var svg = d3.select('body').select('#'+id).append('svg').attr('width',750).attr('height',350);



    /*#############################################################
    ###   Chargement du plan (format svg) et insertion          ###
    ###    dans la balise svg prealablement cree                ### 
    ###############################################################*/
    d3.xml("data/plan_T1_4e.svg","image/svg+xml",function(xml){
        console.log(xml.getElementsByTagName("svg")[0]);
        // on recupere le node 'svg' du xml recupere
        var svgNode = xml.getElementsByTagName("svg")[0];

        // on recupere la liste des elements du svg
        var childs = svgNode.childNodes;
         // pour chaque node, on l'insere dans le svg existant
        for(var i=1;i<childs.length;i++){
            svg.node().appendChild(childs[i]);
        }
    });

}

function put_sensors(kind_wanted){

    $.getJSON( "data/sensors.json", function( data ) {
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
            // on corrige les valeurs de x et y selon le type de capteur
            var value_id = parseInt(salle.split("_")[1]);

            var n = 0;
            if(kind_wanted == "recreate"){
                insert_icon_group();
            }
            else if(kind == kind_wanted){
                if(room_is_full()){
                    // trop de capteurs à afficher -> on regroupe
                    insert_icon();
                    insert_icon_group();
                }
                else{
                    insert_icon();
                }
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
        }
        relocate();
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