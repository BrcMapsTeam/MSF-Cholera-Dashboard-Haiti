function generateDashboard(data,geom){


    var dateFormat = d3.time.format("%d/%m/%y");
    data.forEach(function (e) {
        e.AdmDate = dateFormat.parse(e.AdmDate);
    });

    var ageChart = dc.barChart('#msf-chl-age');
    var timeChart = dc.barChart('#msf-chl-time');
    var sexChart = dc.pieChart('#msf-chl-sex');
    //var mapChart = dc.leafletChoroplethChart('#msf-chl-map');
    var mapChart = dc.rowChart('#msf-chl-map');
    //var incidenceChart = dc.barChart('#msf-chl-ind');
    var dehyChart = dc.pieChart('#msf-chl-deh');
    var durChart = dc.barChart('#msf-chl-dur');

    var cf = crossfilter(data);

    var ageDimension = cf.dimension(function(d){ return d['Age']; });
    var timeDimension = cf.dimension(function(d){ return d['AdmDate']; });
    var sexDimension = cf.dimension(function(d){ return d['Sex']; });
    var mapDimension = cf.dimension(function(d){ return d['Geo_L2']; });
    var dehyDimension = cf.dimension(function(d){ return d['Dehydr_Adm']; });
    var durDimension = cf.dimension(function(d){ return d['StayDays']; });
    
    var ageGroup = ageDimension.group();
    var timeGroup = timeDimension.group();
    var sexGroup = sexDimension.group();
    var mapGroup = mapDimension.group();
    var dehyGroup = dehyDimension.group();
    var durGroup = durDimension.group();

    var all = cf.groupAll();

    var xScaleRange = d3.time.scale().domain([d3.min(data,function(d){return d.AdmDate;}), d3.max(data,function(d){return d.AdmDate;})]);

    timeChart.width($('#msf-chl-time').width())
            .height(150)
            .dimension(timeDimension)
            .group(timeGroup)
            .x(xScaleRange)
            .elasticY(true)
            .colors(['#C62828'])
            .xAxisLabel("Date")
            .yAxisLabel("Cases");

    var xScaleRange = d3.scale.linear().domain([0,100]);        

    ageChart.width($('#msf-chl-age').width())
            .height(150)
            .dimension(ageDimension)
            .group(ageGroup)
            .x(xScaleRange)
            .elasticY(true)
            .colors(['#C62828'])
            .xAxisLabel("Age")
            .yAxisLabel("Cases");  
    
    sexChart.width($('#msf-chl-sex').width()).height(220)
            .dimension(sexDimension)
            .group(sexGroup)
            .colors(['#C62828','#EF5350'])
            .colorDomain([0,1])
            .colorAccessor(function(d,i){
                return i;
            });

    dehyChart.width($('#msf-chl-deh').width()).height(220)
            .dimension(dehyDimension)
            .group(dehyGroup)
            .colors(['#C62828','#EF5350','#EF9A9A'])
            .colorDomain([0,2])
            .colorAccessor(function(d,i){
                return i;
            });

    var xScaleRange = d3.scale.linear().domain([d3.min(data,function(d){return d['StayDays']}),d3.max(data,function(d){return d['StayDays']})]);        

    durChart.width($('#msf-chl-dur').width())
            .height(220)
            .dimension(durDimension)
            .group(durGroup)
            .x(xScaleRange)
            .elasticY(true)
            .colors(['#C62828'])
            .xAxisLabel("Stay Days")
            .yAxisLabel("Cases");                          

    dc.dataCount('#count-info')
            .dimension(cf)
            .group(all);

    mapChart.width($('#msf-chl-map').width()).height(400)
            .dimension(mapDimension)
            .group(mapGroup)
            .data(function(group) {
                return group.top(15);
            })
            .elasticX(true)
            .colors(['#C62828'])
            .colorDomain([0,1])
            .colorAccessor(function(d,i){
                return i;
            });
            /*.on('filtered',function(c,f){
                var filters = c.filters();
                popdimension.filter(function(d){
                    return f.indexOf(d) > -1;
                });
                pop = cfpop.groupAll().reduceSum(function(d) {
                            return d['Pop'];
                        }).value();
                        console.log(pop);                
            });*/

    var xScaleRange = d3.time.scale().domain([d3.min(data,function(d){return d.AdmDate;}), d3.max(data,function(d){return d.AdmDate;})]);

    var incidence = function(d){
        return d.value/pop*10000;
    };    


    /*incidenceChart.width($('#msf-chl-ind').width())
            .height(150)
            .dimension(timeDimension)
            .group(timeGroup)
            .valueAccessor(incidence)
            .x(xScaleRange)
            .elasticY(true)
            .colors(['#ee0000'])
            .xAxisLabel("Date")
            .yAxisLabel("Incidence Rate");*/


    /*mapChart.width($('#msf-chl-map').width()).height(300)
            .dimension(mapDimension)
            .group(mapGroup)
            .center([18.54,-72.4])
            .zoom(13)    
            .geojson(geom)
            .colors(colors)
            .colorDomain([0, 4])
            .colorAccessor(function (d) {
                var c=0;
                if(d>50){
                    c=4;
                } else if (d>20) {
                    c=3;
                } else if (d>10) {
                    c=2;
                }  else if (d>0) {
                    c=1;
                } 
                return c;
            })                          
            .featureKeyAccessor(function(feature){
                return feature.properties['Name'];
            }).popup(function(feature){
                return feature.properties['Name'];
            })
            .renderPopup(true)
            .featureOptions({
                'fillColor': 'black',
                'color': 'gray',
                'opacity':0.5,
                'fillOpacity': 0,
                'weight': 2
            })
            .renderlet(function(e){
                var html = "";
                e.filters().forEach(function(l){
                    html += l+", ";
                });
                $('#mapfilter').html(html);
            });*/


    dc.renderAll();
    
    //var map = mapChart.map();
    //map.scrollWheelZoom.disable();
    //zoomToGeom(geom);

    function zoomToGeom(geom){
        var bounds = d3.geo.bounds(geom);
        map.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]]);
    }

}

/*var cfpop = crossfilter(pop);
var popdimension = cfpop.dimension(function(d){return d.Region;});
var pop = cfpop.groupAll().reduceSum(function(d) {
            return d['Pop'];
        }).value();
        console.log(pop);*/
var colors = ['#DDDDDD','#E1A5A5','#E56E6E','#E93737','#EE0000'];
generateDashboard(data,carrefour);