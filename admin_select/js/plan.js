$(document).ready(function($){
    //TODO refactoring + max capteur / salle (pas ensemble) 
    
    /* #########################################
    #####                                   ####
    #####       Partie checkbox             ####
    #####                                   ####
    ############################################
    */
    
    /* la checkbox 'tous' permet de selectionner tous les 
     * autres checkboxs et d'afficher les elements pour chacune
     */
    $("#checkbox_all").click(function(){
        var checked = $(this).prop('checked');
        $('.my_checkbox').each(function(){
            kind = $(this).attr('id').split('_')[1];
            if(checked){
                this.checked = true;
                put_sensors(kind);
            }
            else{
                this.checked = false;
                 unput_sensors(kind);
            }
        });
    });
    
    /* fonction qui decoche la case 'tous' si elle 
     * coché, fonction appelé que si l'on décoche une
     * autre checkbox
     */
    function uncheck_all_box(box){
        if(!box.prop("checked")){
            $("#checkbox_all").attr("checked",false);
        }
    }
    
    /* affiche/enlève les capteurs correspondant
     * à la checkbox cochée/décochée
     */
    $('.my_checkbox').change(function(){
        uncheck_all_box($(this));
        kind = $(this).attr('id').split('_')[1];
        if($(this).prop("checked")){
            put_sensors(kind,$( "input:checked" ).length);
        }
        else{
            unput_sensors(kind);
        }
        
    });
    
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
        });
        
    }
    
    
    /*
     * Fonction qui supprime tous
     * les capteurs de type kind sur 
     * le plan
     */
    function unput_sensors(kind){
        $.getJSON( "data/sensors.json", function( data ) {
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
            relocate();
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
                        
                        // info bulles
                        $("#circle-"+kind+salle).mouseover(function(){
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
                        $("#circle-"+kind+salle).mouseout(function(){
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
            }
            relocate();
        });
    }
    /*
     * Repositionne deux capteur dans une salle
     * pour un meilleur affichage
     */
    function relocate(){
        $.getJSON( "data/sensors.json", function( data ) {
            var sensors = data.sensors;
            for(i=0;i<sensors.length;i++){
                var salle = sensors[i].salle;
                var size = 0;
                var images = $("#"+salle+">g>image");
                images.each(function(){
                    size++;
                });
                if(size == 2){
                    console.log("relocate");
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
                }
                
            }
        });
    }
    
    $("#plan-select").ready(function(){
        load_svg("data/plan_T1_4e.svg","plan-select");
    });
    
    
    
});