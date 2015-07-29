function generateDashboard(data,geom){


    var dateFormat = d3.time.format("%d-%b-%y");
    data.forEach(function (e) {
        console.log(e.Date);
        e.Date = dateFormat.parse(e.Date);
        //console.log(e.date);
    });

    var ageChart = dc.barChart('#msf-chl-age');
    var timeChart = dc.barChart('#msf-chl-time');
    var sexChart = dc.pieChart('#msf-chl-sex');
    var mapChart = dc.leafletChoroplethChart('#msf-chl-map');

    var cf = crossfilter(data);

    var ageDimension = cf.dimension(function(d){ return d['Age']; });
    var timeDimension = cf.dimension(function(d){ return d['Date']; });
    var sexDimension = cf.dimension(function(d){ return d['Sex']; });
    var mapDimension = cf.dimension(function(d){ return d['Address']; });
    
    var ageGroup = ageDimension.group();
    var timeGroup = timeDimension.group();
    var sexGroup = sexDimension.group();
    var mapGroup = mapDimension.group();
    var all = cf.groupAll();

    var xScaleRange = d3.time.scale().domain([new Date(2010, 9, 23), new Date(2010, 11,24)]);

    timeChart.width($('#msf-chl-time').width())
            .height(150)
            .dimension(timeDimension)
            .group(timeGroup)
            .x(xScaleRange)
            .elasticY(true)
            .colors(['#ee0000'])
            .xAxisLabel("Date")
            .yAxisLabel("Cases");

    var xScaleRange = d3.scale.linear().domain([0,100]);        

    ageChart.width($('#msf-chl-age').width())
            .height(150)
            .dimension(ageDimension)
            .group(ageGroup)
            .x(xScaleRange)
            .elasticY(true)
            .colors(['#ee0000'])
            .xAxisLabel("Age")
            .yAxisLabel("Cases");  
    
    sexChart.width($('#msf-chl-sex').width()).height(300)
            .dimension(sexDimension)
            .group(sexGroup)
            .colors(['#ee0000','#E1A5A5'])
            .colorDomain([0,1])
            .colorAccessor(function(d,i){
                return i;
            });
             

    dc.dataCount('#count-info')
            .dimension(cf)
            .group(all);

    mapChart.width($('#msf-chl-map').width()).height(300)
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
                console.log(feature.properties['Name']);
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
            });


    dc.renderAll();
    
    var map = mapChart.map();
    map.scrollWheelZoom.disable();
    //zoomToGeom(geom);

    function zoomToGeom(geom){
        console.log(geom);
        var bounds = d3.geo.bounds(geom);
        console.log(bounds);
        map.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]]);
    }
}
var colors = ['#DDDDDD','#E1A5A5','#E56E6E','#E93737','#EE0000'];
generateDashboard(data,carrefour);