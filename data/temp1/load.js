$(document).ready(function($){
    var data_alert = [
    {
        'id':'s_48',
        'temp':34
    },{
        'id':'s_18',
        'temp':38
    },{
        'id':'s_22',
        'temp':44
    }
];
// Activer le tooltip Jquery
    $( document ).tooltip({
      track: true
    });
        
        /*#############################################################
        ###   Declarer/creer la balise svg pour le dessin vectoriel ###
        ###############################################################*/
    var true_svg = d3.select('body').select("#temp1").append('svg').attr('width',1271).attr('height',455).attr('id','my_svg');
    
    
    
        /*#############################################################
        ###   Chargement du plan (format svg) et insertion          ###
        ###    dans la balise svg prealablement cree                ### 
        ###############################################################*/
    d3.xml("./data/temp1/plan.svg","image/svg+xml",function(xml){
        // on recupere le node 'svg' du xml recupere
        var svgNode = xml
                    .getElementsByTagName("svg")[0];
        // on recupere la liste des elements du svg
        var childs = svgNode.childNodes;
         // pour chaque node, on l'insere dans le svg existant
        for(var i=1;i<childs.length;i++){
            var first_couche = childs[i].childNodes[1];
            
            if(first_couche != undefined){
                
                // id de la forme a ajouter
                var id = first_couche.getAttribute('id');
                var second_couche = first_couche.childNodes[3];
                var third_couche = second_couche.childNodes[1];
                // nom de la forme a ajouter
                var node_name = third_couche.nodeName;
                true_svg.append(node_name).attr('id',id);
                var node_added = d3.select('#'+id);
                // liste des attributs de la forme
                var my_attributes = third_couche.attributes;
                for(j=0;j<my_attributes.length;j++){
                        var name = my_attributes[j].name;
                        var value = my_attributes[j].value;
                        node_added.attr(name,value);
                }
            }
        }
        $.getJSON( "./data/temp1/alert.json", function( data ) {
            var id = data.id;
            var values = data.values;
            for(i=0;i<values.length;i++){
                var kind = values[i].kind;
                if(kind == "temp"){
                    var id_to_find = values[i].id;
                    var salle = d3.select("#"+id_to_find);
                    salle.style("fill","red")
                        .style("fill-opacity",0.4)
                        .style("stroke","red")
                        .attr("title","id salle : "+id_to_find+"\ntempérature salle : "+values[i].temp+"°C\n");
                }
            }
        });
        /*
        for(i=0;i<data_alert.length;i++){
            
            var id_to_find = data_alert[i].id;
            var salle = d3.select('#'+id_to_find);
            salle.style('fill','red')
                .style('fill-opacity',0.4)
                .style('stroke','red')
            .attr("title","id salle : "+id_to_find+"\ntempérature salle : "+data_alert[i].temp+"°C\n");
        }*/
    });
});