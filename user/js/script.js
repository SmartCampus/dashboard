$(document).ready(function($){
    /**
     * Partie concernant l'horloge
     * pour représenter le temps d'attente
     */
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
    
    
    /* ###################################################################
    ########                                                       #######
    ########            Widget moyennes (barres)                   #######
    ########                                                       #######
    ######################################################################*/
    
    $.getJSON('./data/moyenne-attente.json', function(data) {
        var avgs = [];
        var dates = [];
        console.log(data);
        var id = data.id;
        var values = data.values;
        for(i=0;i<values.length;i++){
            avgs[i] = values[i].value;
            dates[i] = values[i].date;
        }
        console.log(avgs);
        
        
        $('#moyenne-attente').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Temps moyen d\'attente au RU'
            },
            subtitle: {
                text: 'Source: SmartCampus'
            },
            xAxis: {
                categories: dates
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'attente (minutes)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} min</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Temps d\'attente',
                data: avgs
    
            }]
        });
	});
    
});