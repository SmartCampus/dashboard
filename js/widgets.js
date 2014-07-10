$(document).ready(function($){
    
    
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
        $('#chart_pie').highcharts({
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
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Park share',
                data: [
                    ['Libre',   45],
                    ['Occupé',  55]
                ]
            }]
        });
    
    /* ###################################################################
    ########                                                       #######
    ########            Widget temperature                         #######
    ########                                                       #######
    ######################################################################*/
    var json;
    var temps = [];
    var dates = [];
    $.getJSON( "./data/tempV.json", function( data ) {
        var id = data.id;
        var values = data.values;
        for(i=0;i<values.length;i++){
            temps[i] = values[i].value;
            dates[i] = values[i].date;
        }
        var temp = Math.round(temps[0]*10)/10;
    $('#chart_temp').highcharts({

        chart: {
            type: 'gauge',
            alignTicks: false,
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: 'T° actuelle (mais on sait pas où)'
        },

        pane: {
            startAngle: -160,
            endAngle: 160
        },	        

        yAxis: [{
            min: -20,
            max: 60,
            tickPosition: 'outside',
            lineColor:{
    radialGradient: { cx: 0, cy: 0.6, r: 1 },
    stops:[

       [0, '#3366AA'],
       [1, '#933']
    ]
    },
            lineWidth: 2,
            minorTickPosition: 'outside',
            tickColor: {
    radialGradient: { cx: 0, cy: 0.6, r: 1 },
    stops:[

       [0, '#3366AA'],
       [1, '#933']
    ]
    },
            minorTickColor: '#933',
            tickLength: 5,
            minorTickLength: 5,
            labels: {
                distance: 12,
                rotation: 'auto'
            },
            offset: -20,
            endOnTick: true
        }],

        series: [{
            name: 'Température',
            data: [0],
            dataLabels: {
                formatter: function () {
                    var celsius = this.y;
                    return '<span style="color:#339">'+ celsius + ' °C</span><br/>'
                },
                backgroundColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#DDD'],
                        [1, '#FFF']
                    ]
                }
            },
            tooltip: {
                valueSuffix: ' °C'
            }
        }]

    },
        // Add some life
        function(chart) {
            setInterval(function() {
                var point = chart.series[0].points[0],
                    newVal, inc = Math.round((temp*10))/10;

                newVal = point.y + inc;
                if (newVal < 0 || newVal > 200) {
                    newVal = point.y - inc;
                }

                point.update(inc);

            }, 300);

        });
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
        
        
        $('#chart_column').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Temps moyen d\'attente au RU'
            },
            subtitle: {
                text: 'Source: quelquepart.com'
            },
            xAxis: {
                categories: dates
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'attente (min)'
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