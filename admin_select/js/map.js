insert_all_marker(); 
/* Info bulle by maps */
var infowindow = [
        new google.maps.InfoWindow({
              content: "IUT"
          }),new google.maps.InfoWindow({
              content: "Forum"
          }),new google.maps.InfoWindow({
              content: "<a href='select-plan.html'>Templier 1</a>"
          }),new google.maps.InfoWindow({
              content: "Templier 2 (sud)"
          }),new google.maps.InfoWindow({
              content: "Templier 2 (barette haute)"
          }),new google.maps.InfoWindow({
              content: "Templier 2 (barrette basse)"
          })
];
$(document).ready(function($){
    $("#form_radio").hide();
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
                
                $('.my_radio').each(function(){
                    this.checked = false;
                    load_and_launch("data/sensors.json",handle_marker,remove_info_marker,[kind]);
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
                $("#form_radio").hide();
                $("#form_check").show();

            }
        });
    });
    
    /* affiche/enlève les capteurs correspondant
     * à la checkbox cochée/décochée
     */
    $('.my_checkbox').change(function(){
        var kind = $(this).attr('id').split('_')[1];
        //uncheck_all_box($(this));
        if($(this).prop("checked")){
            load_and_launch("data/sensors.json",handle_marker,add_info_marker,[kind]);
        }
        else{
            load_and_launch("data/sensors.json",handle_marker,remove_info_marker,[kind]);
        }
        
    });
    
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
                if(!already_checked)load_and_launch("data/sensors.json",handle_marker,add_info_marker,[kind]);
            }
            else{
                this.checked = false;
                load_and_launch("data/sensors.json",handle_marker,remove_info_marker,[kind]);
            }
        });
    });
});

