$(document).ready(function($){
    
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
                put_sensors(kind,"data/sensors.json");
            }
            else{
                this.checked = false;
                 unput_sensors(kind,"data/sensors.json");
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
});