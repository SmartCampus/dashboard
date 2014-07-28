$(document).ready(function($){
    var select_waiting = $("#select-day-waiting");
    $(select_waiting).change(function(){
        var day = $(this).val();
        update_avg("data/moyenne-attente.json","moyenne-attente",day,"Temps d'attente","attente (minutes)","Temps moyen d'attente au RU","min");
    });
    var select_occupation = $("#select-day-waiting");
    $(select_occupation).change(function(){
        var day = $(this).val();
        update_avg("data/moyenne-occupation.json","stat-park",day,"Taux d'occupation","occupation (%)","Taux d'occupation moyen des parkings","%");
    });
});

function display_clock(id,title,url){
    /**
     * Partie concernant l'horloge
     * pour représenter le temps d'attente
     */
    $.getJSON(url, function( data ){
        $("#title-time-left").append("Attente actuelle : <p id='number-time-left'>"+data.value+" mins</p>");
       var chart = AmCharts.makeChart(id, {
           "titles": [
                {
                    "text": title,
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
        setTimeout(updateClock, 1000);


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
            clearTimeout();
        }
    });
}
    
  
/* ###################################################################
########                                                       #######
########            Widget moyennes (barres)                   #######
########                                                       #######
######################################################################*/

function update_avg(url,id_div,day,x_legende,y_legende,title,unit){
    $.getJSON(url, function(data) {
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
        set_values_charts(id_div,dates,avgs,x_legende,y_legende,title,unit);
        
    });
}

function set_values_charts(id,dates,avgs,x_legende,y_legende,title,unit){
    $("#"+id).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: title
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
                text: y_legende
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} '+unit+'</b></td></tr>',
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
            name: x_legende,
            data: avgs

        }]
    });
}



function init_gauge_park(id,value,parking){
    var gaugeChart = AmCharts.makeChart(id, {
        "titles": [
            {
                "text": "Parking "+parking,
                "size": 13
            }
        ],
        "type": "gauge",
        "theme": "none",    
        "axes": [{
            "axisThickness":1,
             "axisAlpha":0.2,
             "tickAlpha":0.2,
             "valueInterval":20,
            "bands": [{
                "color": "#84b761",
                "endValue": 45,
                "innerRadius": "0%",
                "startValue": 0
            }, {
                "color": "#fdd400",
                "endValue": 75,
                "innerRadius": "0%",
                "startValue": 45
            }, {
                "color": "#cc4748",
                "endValue": 95,
                "innerRadius": "0%",
                "startValue": 75
            },{
                "color": "black",
                "endValue": 100,
                "innerRadius": "0%",
                "startValue": 95
            }],
            "bottomText": "0 %",
            "bottomTextYOffset": -20,
            "endValue": 100
        }],
        "arrows": [{
            "color":"#046380",
            "nailRadius": 4,
            "startWidth": 6,
            "innerRadius": 0,
            "borderAlpha":1
        }]
    });
    setTimeout(setValue, 1000);

     // set random value
    function setValue() {
        gaugeChart.arrows[0].setValue(value);
        gaugeChart.axes[0].setBottomText(value + " %");
        clearTimeout();
    }
}
    
    