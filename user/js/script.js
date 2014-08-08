$(document).ready(function($){
    var select_waiting = $("#select-day-waiting");
    $(select_waiting).change(function(){
        var day = $(this).val();
        update_avg("data/moyenne-attente.json","moyenne-attente",day,"Temps d'attente","attente (minutes)","Temps moyen d'attente au RU","min");
    });
    var select_occupation = $("#select-day-occupation");
    var select_parking = $("#select-parking");
    $(select_occupation).change(function(){
        var day = $(this).val();
        var parking = parseInt($(select_parking).val());
        update_avg("data/moyenne-occupation.json","stat-park",day,"Taux d'occupation","occupation (%)","Taux d'occupation moyen des parkings","%",parking);
    });
    $(select_parking).change(function(){
        var parking = $(this).val();
        var day = parseInt($(select_occupation).val());
        update_avg("data/moyenne-occupation.json","stat-park",day,"Taux d'occupation","occupation (%)","Taux d'occupation moyen des parkings","%",parking);
    });
});

function display_pie_park(id,occuped){
    /* ###################################################################
    ########                                                       #######
    ########            Widget Pie chart                           #######
    ########                                                       #######
    ######################################################################*/
    
    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
        return {
            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });

    // Build the chart
    $('#'+id).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Occupation actuelle des parkings'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                minSize : 150,
                allowPointSelect: true,
                cursor: 'pointer'
                /*dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }*/
            }
        },
        series: [{
            type: 'pie',
            name: 'Park share',
            data: [
                ['Libre',   100-occuped],
                ['Occupé',  occuped]
            ]
        }]
    });
}

function display_clock(id,url){
    /**
     * Partie concernant l'horloge
     * pour représenter le temps d'attente
     */
    $.getJSON(url, function( data ){
        $("#title-time-left").append("Attente actuelle : <p id='number-time-left'>"+data.value+" mins</p>");
        var legend = new AmCharts.AmLegend();
        
       var chart = AmCharts.makeChart(id, {
            "type": "gauge",
            "theme": "none",
            "startDuration": 0.3,
            "marginBottom":210,	
            "axes": [{
                "axisAlpha": 0.8,
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
}
    
  
/* ###################################################################
########                                                       #######
########            Widget moyennes (barres)                   #######
########                                                       #######
######################################################################*/

/* Met a jour les données pour les bar charts depuis
 * un fichier json
 */
function update_avg(url,id_div,day,x_legende,y_legende,title,unit,parking){
    $.getJSON(url, function(data) {
        var avgs = [];
        var dates = [];
        var arrival = [];
        var departure = [];
        var id = data.id;
        var values;
        var all_values;
        if(parking == undefined){
            all_values = data;
        }
        else{
            switch(parseInt(parking)){
                    case 1:all_values = data.parkings.P1[day-1];break;
                    case 2:all_values = data.parkings.P2[day-1];break;
                    case 3:all_values = data.parkings.P3[day-1];break;
                    case 4:all_values = data.parkings.P4[day-1];break;
                    case 5:all_values = data.parkings.P5[day-1];break;
                    case 6:all_values = data.parkings.P6[day-1];break;
                    default:all_values = data.parkings.P1[day];break;
            }
        }
        switch(parseInt(day)){
            case 1:values = all_values.day_1;break;
            case 2:values = all_values.day_2;break;
            case 3:values = all_values.day_3;break;
            case 4:values = all_values.day_4;break;
            case 5:values = all_values.day_5;break;
            default:values = all_values.day_1;break;
        }
        
        for(i=0;i<values.length;i++){
            avgs[i] = values[i].avg;
            arrival[i] = values[i].arrival;
            departure[i] = values[i].departure;
            dates[i] = values[i].date;
        }
        set_values_charts(id_div,dates,avgs,arrival,departure,x_legende,y_legende,title,unit);
        
    });
}

function set_values_charts(id,dates,avgs,arrival,departure,x_legende,y_legende,title,unit){
    var series = [];
    series[0] = {
        name : "Taux d'occupation (%)",
        data : avgs
    };
    if(departure[0] != undefined){
        series[1] = {
            name: "Nombre de départs",
            yAxis: 1,
            data: departure
            
        };
    }
    if(arrival[0] != undefined){
        series[2] = {
            name: "Nombre d'arrivées",
            yAxis: 1,
            data: arrival
        };
    }
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
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value} %'
            },
            title: {
                text: 'Taux d\'occupation'
            }
        }, { // Secondary yAxis
            title: {
                text: 'Valeur'
            },
            labels: {
                format: '{value}'
            },
            opposite: true
        }],
        tooltip: {
            headerFormat: '<span class="title-gauge" style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
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
        series: series
    });
}



function init_gauge_park(id,value,max,id_title){
    document.getElementById(id_title).innerHTML = max-value;
    var gaugeChart = AmCharts.makeChart(id, {
        "type": "gauge",
        "theme": "none",    
        "axes": [{
            "axisThickness":20,
             "axisAlpha":0.3,
             "tickAlpha":0.2,
             "valueInterval":100,
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
            "bottomTextYOffset": 0,
            "endValue": 100
        }],
        "arrows": [{
            "color":"#8CC6D7",
            "nailRadius": 10,
            "startWidth": 20,
            "innerRadius": 0,
            "borderAlpha":0
        }]
    });
    setTimeout(setValue, 1000);

     // set random value
    function setValue() {
        var taux = Math.round((value/max)*10000)/100;
        gaugeChart.arrows[0].setValue(taux);
        gaugeChart.axes[0].setBottomText(taux + " %");
        clearTimeout();
    }
}
    
    