$(document).ready(function($){
    var legend = { temp:"Température en °C",
                  other:"Présence capteur = 1"}
    $('#form_radio').hide();
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
            if(checked){
                this.checked = true;
                if(!already_checked)put_sensors(kind,"data/sensors.json");
            }
            else{
                this.checked = false;
                clear_icons();
            }
        });
    });
    
    
    /*
     * Active ou désactive l'affichage par
     * carte de chaleur
     */
    $("#myonoffswitch").click(function(){
        var checked = $(this).prop("checked");
        if(checked){
            $('#checkbox_all').prop("checked",false);
            $('.my_checkbox').each(function(){
                var kind = $(this).attr('id').split('_')[1];
                this.checked = false;
                clear_icons();  
                $('.my_radio').each(function(){
                    this.checked = false;
                });
            });
        }
        $('.choice').each(function(){
            var id = $(this).attr('id');
            var parent = $(this).parent();
            if(checked){
                $("#form_radio").show();
                $("#form_check").hide();
            }
            else{
                remove_canvas();
                $("#form_radio").hide();
                $("#form_check").show();

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
        var kind = $(this).attr('id').split('_')[1];
        uncheck_all_box($(this));
        if($(this).prop("checked")){
            put_sensors(kind,"data/sensors.json");
        }
        else{
            unput_sensors(kind,"data/sensors.json");
        }
        
    });
    
    $('.my_radio').change(function(){
        var kind = $(this).attr('id').split('_')[1];
        if($(this).prop("checked")){
            remove_canvas();
            init_heatmap(kind);
            // TODO revoir fonction init avec kind + desactiver capteur sur switch
        }
    });
    
    
    function init_heatmap(kind_wanted,heatmap){
        $.getJSON('data/sensors.json',function(data){
            var sensors = data.sensors;
            var data = [];
            var max = 45;
            var title = legend["other"];
            for(i=0;i<sensors.length;i++){
                var kind = sensors[i].kind;
                if(kind == kind_wanted){
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
                    var value;
                    var actual_value = sensors[i].value;
                    if(kind_wanted != "temp"){
                        if(actual_value){
                            value = 1;
                        }
                        else{
                            value = 0;
                        }
                        max = 1;
                    }
                    else{
                        value = actual_value;
                        title = legend["temp"];
                    }
                    console.log(value);
                    data.push({
                        x : x_tmp + size_x/2,
                        y : y_tmp + size_y/2,
                        count : value
                    });
                }            
            }
            // heatmap configuration
            var config = {
                element: document.getElementById("plan-select"),
                radius: 35,
                opacity: 50,
                legend: {
                    position: 'br',
                    title: title
                }
            };

            //creates and initializes the heatmap
            heatmap = h337.create(config);

            // let's get some data
            var data = {
                max: max,
                data: data
            };

            heatmap.store.setDataSet(data);
        });
        
    }    
    function remove_canvas(){
        $('canvas').remove();
        $("#plan-select>div").remove();
    }
    
});