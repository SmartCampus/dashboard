$(document).ready(function($){
    $.getJSON( "./data/temps.json", function( data ){
        $("#title-time-left").append("Temps d'attente actuel : "+data.value+" min(s)");
        var chart = AmCharts.makeChart("time-left", {
            "type": "gauge",
            "theme": "none",
            "startDuration": 0.5,
            "marginTop":20,
            "marginBottom":50,	
            "axes": [{
                "axisAlpha": 0.3,
                "endAngle": 360,
                "endValue": 60,
                "minorTickInterval": 0.2,
                "showFirstLabel": false,
                "startAngle": 0,
                "axisThickness": 1,
                "valueInterval": 10
            }],
            // les aiguilles
            "arrows": [{
                "radius": "60%",
                "innerRadius": 0,
                "clockWiseOnly": true,
                "nailRadius":10,
                "nailAlpha": 1
            }, {
                "nailRadius": 0,
                "radius": "90%",
                "startWidth": 10,
                "innerRadius": 0,
                "clockWiseOnly": true
            }],
            exportConfig:{	  
              menuItems: [{
              icon: 'http://www.amcharts.com/lib/3/images/export.png',
              format: 'png'	  
              }]  
            }
        });
        setInterval(updateClock,1000);


        // set la valeur de la grande aiguille sur la valeur actuelle du temps restant
        function updateClock() {
            // get current time left
                 var time = data.value;
                 // set time
                chart.arrows[1].setValue(time);
        }
    });
    
});