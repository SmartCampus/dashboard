$(document).ready(function($){
    init_heatmap();
    
    var heatmap;
    
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
            var already_checked = $(this).prop('checked');
            if(kind == "heat"){
                if(checked){
                    this.checked = true;
                    show_heatmap();
                }
                else{
                    this.checked = false;
                    hide_heatmap();
                }
            }
            else{
                if(checked){
                    this.checked = true;
                    if(!already_checked)put_sensors(kind,"data/sensors.json");
                }
                else{
                    this.checked = false;
                    unput_sensors(kind,"data/sensors.json");
                }
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
            put_sensors(kind,"data/sensors.json");
        }
        else{
            unput_sensors(kind,"data/sensors.json");
        }
        
    });
    
    $('#checkbox_heat').change(function(){
        if($(this).prop("checked")){
            show_heatmap(heatmap);
        }
        else{
            hide_heatmap(heatmap);
        }
    });
    
    function init_heatmap(){
        $.getJSON('data/sensors.json',function(data){
            var sensors = data.sensors;
            var data = [];
            
            for(i=0;i<sensors.length;i++){
                var kind = sensors[i].kind;
                if(kind == "temp"){
                    var salle_svg = $("#"+sensors[i].salle+">g").children().eq(0);

                    var balise = salle_svg.get(0).nodeName;              
                    var x_tmp,y_tmp,size_x,size_y;
                    // on affecte les valeurs de x et y selon la forme vectorielle de la salle

                    if(balise == "rect"){    
                        size_x = parseFloat(salle_svg.attr('width'));
                        size_y = parseFloat(salle_svg.attr('height'));
                        x_tmp = parseFloat(salle_svg.attr('x'));
                        y_tmp = parseFloat(salle_svg.attr('y'));
                    }
                    data.push({
                        x : x_tmp + size_x/2,
                        y : y_tmp + size_y/2,
                        count : sensors[i].value
                    });
                }            
            }
            // heatmap configuration
            var config = {
                element: document.getElementById("plan-select"),
                radius: 40,
                opacity: 50,
                legend: {
                    position: 'br',
                    title: 'Température en °C'
                }
            };

            //creates and initializes the heatmap
            var heatmap = h337.create(config);

            // let's get some data
            var data = {
                max: 45,
                data: data
            };

            heatmap.store.setDataSet(data);
            hide_heatmap();
        });
        
    }
    
    function hide_heatmap(){
        $('canvas').hide();
        $("#plan-select>div").hide();
    }
    function show_heatmap(){
        $('canvas').show();
        $("#plan-select>div").show();
    }
    
});