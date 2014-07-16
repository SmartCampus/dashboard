$(document).ready(function($){
    
    $("plan-security").ready(function(){
        load_svg("../data/plan_T1_4e.svg","plan-security",add_icon);
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
        var salle = svg.select('#'+id_salle).select('g').select("rect");
        var x = salle.attr('x');
        var y = salle.attr('y');
        svg.append("image")
            .attr("xlink:href","../data/img/test.jpg")
            .attr('width', 20)
            .attr('height', 24)
            .attr('x', x)
            .attr('y', y);
    }
    
    
});