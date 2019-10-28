// define margin, width, height... 
var margin = {top: 0, right: 0, bottom: 0, left: 360},
                width = 1200 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom,
                centered;
// set/define up path 
var path = d3.geoPath();

// setup map/svg
var svgMap = d3.select("#worldmap")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append('g')
                .attr('class', 'map');
// same..              
var borderPath = d3.select("#worldmap").append("rect")
          .attr("x", -1000)
          .attr("y", 0)
          .attr("height", height)
          .attr("width", width)
          .style("stroke", 'black')
          .style("fill", "none")
          .style("stroke-width", 2);

// using mercartor projection 
var projection = d3.geoMercator()
                    .scale(130)
                    .translate( [width/2, height/2]);

var path = d3.geoPath().projection(projection);

// Define the div for the tooltip
var tooltip = d3.select("#worldmap").append("div") 
            .attr("class", "tooltip")       
            .style("opacity", 0);
    
// function to redraw map on selection 
function DrawConnectionMap(leauge){
    var filename = './data/' + leauge + '.tsv'
    
    //console.log(filename);
    
    // use queue to read multiple files at once 
    queue()
        .defer(d3.json, "./data/custom.geo.json")
        //.defer(d3.tsv, "world_population.tsv")
        .defer(d3.tsv, filename)
        .await(ready);

        // add player no. and lat and long for the corresponding country
        function ready(error, data, population) {
            
           // console.log(population);
            
            // prefill in population to 0, otherwise cannot draw map 
            for (z in data.features){
                data.features[z].properties.population = 0
                //console.log(data.features[z].properties)
            }

            for (i in population){

                for (j in data.features){

                    if(population[i].id === data.features[j].properties.adm0_a3){

                        // add player no. and country name 
                        data.features[j].properties.population = population[i].population
                        data.features[j].properties.name = population[i].name
                        data.features[j].properties.x1 = population[i].x1
                        data.features[j].properties.y1 = population[i].y1
                        data.features[j].properties.x2 = population[i].x2
                        data.features[j].properties.y2 = population[i].y2
                    }
                }
            } 
      
          // add colors to country with players and without 
          for (k in data.features){
              
              if (data.features[k].properties.population > 0){
                  
                  data.features[k].properties.colors = '#ADD8E6'
                  data.features[k].properties.circlecolors = '#ADD8E6'
                 
              }
              if (data.features[k].properties.population < 1){
                  data.features[k].properties.colors = '#D3D3D3'
                  data.features[k].properties.circlecolors = 'white'
              }

          }   
            
          for (x in data.features){  
              
        // change league country color
            if (leauge === 'LaLiga'){
                if(data.features[x].properties.adm0_a3 === 'ESP'){
                    data.features[x].properties.colors = '#C71585'
                    data.features[x].properties.circlecolors = 'black'
                    //console.log(data.features[x].properties.adm0_a3)
                }
            }
            if (leauge === 'EPL'){
                if(data.features[x].properties.adm0_a3 === 'GBR'){
                    data.features[x].properties.colors = '#C71585'
                    data.features[x].properties.circlecolors = 'black'
                    //console.log(data.features[x].properties.adm0_a3)
                }
            } 
            if (leauge === 'Bundesliga'){
                if(data.features[x].properties.adm0_a3 === 'DEU'){
                    data.features[x].properties.colors = '#C71585'
                    data.features[x].properties.circlecolors = 'black'
                    //console.log(data.features[x].properties.adm0_a3)
                }
            }
            if (leauge === 'SerieA'){
                if(data.features[x].properties.adm0_a3 === 'ITA'){
                    data.features[x].properties.colors = '#C71585'
                    data.features[x].properties.circlecolors = 'black'
                    //console.log(data.features[x].properties.adm0_a3)
                }
            }
            if (leauge === 'Ligue1'){
                if(data.features[x].properties.adm0_a3 === 'FRA'){
                    data.features[x].properties.colors = '#C71585'
                    data.features[x].properties.circlecolors = 'black'
                    //console.log(data.features[x].properties.adm0_a3)
                }
            }
          }

         // add map 
          svgMap.append("g")
              .attr("class", "countries")
            .selectAll("path")
              .data(data.features)
            .enter().append("path")
              .attr("d", path)
              //.style("fill",'blue')
              .style("fill", function(d) { return d.properties.colors; })
              .style('stroke', 'black')
              .style('stroke-width', 1.5)
              .style("opacity",0.8)
              // tooltips
              .style("stroke","black")
              .style('stroke-width', 0.3)
              .on("click", clicked)
                .on("mouseover", function(d) {    
              
                  d3.select(this)
            .style("opacity", 1)
            .style("stroke","#FFE4B5")
            .style("stroke-width",3);
              
                tooltip.transition()    
                .duration(200)    
                .style("opacity", .9);    
                tooltip.html(d.properties.name + "<br/>" + d.properties.population + ' players')  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY) + "px");  
              })          
              .on("mouseout", function(d) {  
              
               d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","black")
            .style("stroke-width",0.3);
              
                tooltip.transition()    
                .duration(500)    
                .style("opacity", 0); 
              });
            
            // remove circles first, this is for redrawing  
            var c = d3.selectAll('circles.points');
            c = c.remove();
            // draw circle
            svgMap.selectAll("circles.points")
                .data(data.features)
                .enter()
                .append("circle")
                .attr('class', function(d){ return d.properties.id; })
                .attr("r",1.5)
                .style('fill', function(d) { return d.properties.circlecolors; })
                .attr("transform", function(d) {
                    if(d.properties.y1 > 0 && d.properties.x1 > 0)
                        return "translate(" + projection([d.properties.y1, d.properties.x1]) + ")";})
                ;

            // remove lines first, this is for redrawing  
            var l = d3.selectAll('line');
            l = l.remove();
            
            // draw lines
            svgMap.selectAll("line")
                        .data(data.features)
                        .enter().append("line")
                        //.attr("class", function(d){ return d.node01 + " " + d.node02; })
                        .attr("x1", function(d) { 
                                if(d.properties.population > 0 )
                                    return projection([d.properties.y1, d.properties.x1])[0]; })
                        .attr("y1", function(d) { 
                                if(d.properties.population > 0 )
                                    return projection([d.properties.y1, d.properties.x1])[1]; })
                        .attr("x2", function(d) { 
                                if(d.properties.population > 0 )
                                    return projection([d.properties.y2, d.properties.x2])[0]; })
                        .attr("y2", function(d) { 
                                if(d.properties.population > 0 )
                                    return projection([d.properties.y2, d.properties.x2])[1]; })
                        .attr("stroke-width", function(d) { return d.properties.population/10; })
                        //.attr("stroke","#008080");
                        .attr("stroke","green");
            
            // for the indication blue box on the top left of map 
            var legendZone = svgMap.append('g');
            
            legendZone.remove()
            
            var leaguename = ''
                if (leauge === 'EPL'){
                    var leaguename = 'English Premier League'
                }
                if (leauge === 'LaLiga'){
                    var leaguename = 'Spainish LaLiga'
                }
                if (leauge === 'Bundesliga'){
                    var leaguename = 'Germany Bundesliga'
                }
                if (leauge === 'SerieA'){
                    var leaguename = 'Italy Serie A'
                }
                if (leauge === 'Ligue1'){
                    var leaguename = 'French Ligue1'
                }
            
            // remove rect first, this is for redrawing   
            var r = d3.selectAll('rect.label');
            r = r.remove();
            
            var box = svgMap.append("rect")
                .attr("class", "label")
       			.attr("x", 0)
       			.attr("y", 0)
       			.attr("height", 20)
       			.attr("width", leaguename.length*6.5 + 20)
       			.style("stroke", 'blue')
       			.style("fill", "blue")
                .style('fill-opacity',0.3)
       			.style("stroke-width", 1);
            
            // remove text first,this is for redrawing   
            var t = d3.selectAll('text.title');
            t = t.remove();
            
            var title = svgMap.append("text")
				.attr("class", "title")
				//.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
				.attr("x", 3)
				.attr("y", 15)
				.attr("font-size", "13px")
				.attr("fill", "#404040")
                .style("font-family", "arial")
                .style("font-weight", "bold")
				.text(leaguename);


    };
    
            // variables for legend
            const colors = ["#C71585","#ADD8E6"];
            // set a two length array for number of legends
            var lengedlenth = ["League", "Contributing country "]
    
            // lenged 
            var legend = svgMap.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(' +  12 + ', 0)');

            legend.selectAll('rect')
                .data(lengedlenth)
                .enter()
                .append('rect')
                .attr('x', 0)
                .attr('y', function(d, i){
                    return (i * 15)+(height/0.6);
                })
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', function(d, i){
                    return colors[i];
                });
           
             legend.selectAll('text')
                  .data(lengedlenth)
                  .enter()
                  .append('text')
                  .text(function(d){
                     return d;
                  })
                  .attr('x', 15)
                  .attr('y', function(d, i){
                    return (i * 15)+(height/0.6);
                  })
                  .attr('text-anchor', 'start')
                  .attr('alignment-baseline', 'hanging')
                  .style("font-size","10px")
                  .style("font-family",'"Lato", sans-serif');


    // zoom in function  
    function clicked(d) {
      var x, y, zoom;
    
      // find where clicked and centre that, then half the view around this centre point 
      // if centered not defined, assing it x y/ lon lat values 
      if (d && centered !== d) {
        var centroid = path.centroid(d);
        //console.log(centroid)
        x = centroid[0];
        y = centroid[1];
        zoom = 2;
        centered = d;
      // if centered defined, means already zoomed in, so zoom out again 
      } else {
        x = width / 2;
        y = height / 2;
        zoom = 1;
        centered = null;
      }
    
      // animation for zoom in and out 
      svgMap.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoom + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px");
        
        
    };

}