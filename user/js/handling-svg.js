//TODO lien vers maps
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
    var svg = d3.select('body').select('#'+id).append('svg').attr('width',750).attr('height',350).attr('id','plan_svg');



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
        callback("data/salles.json");
    });

}

function update_rooms(url_json){
    $.getJSON(url_json,function( data ){
        var salles = data.salles;
        var svg_node = d3.select('body').select('#plan-svg');
        for(i=0;i<salles.length;i++){
            var value = salles[i].value;
            var id_salle = salles[i].id_salle;
            var salle_svg = d3.select('body').select("#"+id_salle+">g>rect");
            var color = (value)?'green':'red';
            var status = (value)?'libre':'occupée';
            salle_svg.style('fill',color).attr('title',"Salle "+id_salle+" "+status).attr('id','salle_'+id_salle);
            init_tooltip('#salle_'+id_salle);
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