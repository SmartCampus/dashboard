$(document).ready(function($){
    /**
     * Partie concernant l'horloge
     * pour représenter le temps d'attente
     */
    $.getJSON( "./data/temps.json", function( data ){
        $("#title-time-left").append("Attente actuelle : <p id='number-time-left'>"+data.value+" mins</p>");
       var chart = AmCharts.makeChart("time-left", {
           "titles": [
                {
                    "text": "Heure à laquelle vous mangerez : ",
                    "size": 13
                }
            ],
            "type": "gauge",
            "theme": "none",
            "startDuration": 0.3,
            "marginTop":1,
            "marginBottom":180,	
            "axes": [{
                "axisAlpha": 0.3,
                "endAngle": 360,
                "endValue": 12,
                "minorTickInterval": 0.2,
                "showFirstLabel": false,
                "startAngle": 0,
                "axisThickness": 1,
                "valueInterval": 1
            }],
            "arrows": [{
                "radius": "50%",
                "innerRadius": 0,
                "clockWiseOnly": true,
                "nailRadius":10,
                "nailAlpha": 1
            }, {
                "nailRadius": 0,
                "radius": "80%",
                "startWidth": 6,
                "innerRadius": 0,
                "clockWiseOnly": true
            }, {
                "color": "#CC0000",
                "nailRadius": 4,
                "startWidth": 3,
                "innerRadius": 0,
                "clockWiseOnly": true,
                "nailAlpha": 1
            }],
            exportConfig:{	  
              menuItems: [{
              icon: 'http://www.amcharts.com/lib/3/images/export.png',
              format: 'png'	  
              }]  
            }
        });
        // update each second
        setInterval(updateClock, 1000);


        // update clock
        function updateClock() {
            // get current date
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            // set hours
            chart.arrows[0].setValue(hours + minutes / 60);
            // set minutes
            chart.arrows[1].setValue((12 * ((minutes+data.value) + seconds / 60) / 60));
            // set seconds
            chart.arrows[2].setValue(12 * date.getSeconds() / 60);
        }
    });
    
    
    /* ###################################################################
    ########                                                       #######
    ########            Widget moyennes (barres)                   #######
    ########                                                       #######
    ######################################################################*/
    var select = $("#select-day");
    $(select).change(function(){
        var day = $(this).val();
        update_avg(day);
    });
    function update_avg(day){
        $.getJSON('./data/moyenne-attente.json', function(data) {
            var avgs = [];
            var dates = [];
            var id = data.id;
            var values;
            switch(parseInt(day)){
                    case 1:values = data.day_1;break;
                    case 2:values = data.day_2;break;
                    case 3:values = data.day_3;break;
                    case 4:values = data.day_4;break;
                    case 5:values = data.day_5;break;
                    default:values = data.day_1;break;
            }
            for(i=0;i<values.length;i++){
                avgs[i] = values[i].value;
                dates[i] = values[i].date;
            }


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
    }
    update_avg(0);
    
    
});