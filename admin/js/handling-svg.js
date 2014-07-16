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
            callback("s_1");
        });
        
    }
    
    /**
     * Fonction qui ajoute un icone sur la salle
     * correspondant à l'id en paramètre
     */
    function add_icon(id_salle){
        $.getJSON( "./data/alertes.json", function( data ) {
            var alertes = data.alertes;
            for(i=0;i<alertes.length;i++){
                var kind = alertes[i].kind;
                var x;
                var y;
                var id_to_find = alertes[i].id;
                var salle = $("#"+id_to_find+">g").children().eq(0);
                var balise = salle.get(0).nodeName;
                if(balise == "rect"){
                    var size_x = salle.attr('width')/3;
                    var size_y = salle.attr('height')*3/4;                   
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
                
                // TODO (3)virer le polygon et gerer position des fenetres + (4)gerer mouseover + (1)legende + (2)list alerte ..... mouais
                
                 svg.append("image")
                        .attr("xlink:href","./data/img/"+kind+".png")
                        .attr('width', 20)
                        .attr('height', 24)
                        .attr('x', x)
                        .attr('y', y);
            }
        });
    }
    
    
});