$(document).ready(function($){
    
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
                if(!already_checked)load_urljson_and_launch("../common-data/sensors.json",put_sensors,kind,"img/"+kind+".png");
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
            load_urljson_and_launch("../common-data/sensors.json",put_sensors,kind,"img/"+kind+".png");
        }
        else{
            load_urljson_and_launch("../common-data/sensors.json",unput_sensors,kind,"img/"+kind+".png");
        }
        
    });
    
    $('.my_radio').change(function(){
        var kind = $(this).attr('id').split('_')[1];
        if($(this).prop("checked")){
            remove_canvas();
            load_data_heatmap_urljson("../common-data/sensors.json",kind);
        }
    });
    
       
    function remove_canvas(){
        $('canvas').remove();
        $("#plan-select>div").remove();
    }
    
});