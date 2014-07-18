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
            }
            else{
                this.checked = false;
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
    
    function put_sensors(){}
    
    $("#plan-select").ready(function(){
        load_svg("data/plan_T1_4e.svg","plan-select",put_sensors);
    });
    
    
    
});