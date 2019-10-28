// define 4 math constants, used for plotting the radar charts especially the circles
    const max = Math.max;
    const sin = Math.sin;
    const cos = Math.cos;
    const HALF_PI = Math.PI / 2;

// function to redraw chart upon selection 
function RadarChart(league,position) {
    
	var cfg = {
	 w: 540,				//Width of the circle
	 h: 450,				//Height of the circle
	 margin: { top: 100, right: 110, bottom: 50, left: 110 }, //The margins of the SVG
	 levels: 4,				//How many levels or inner circles should there be drawn
	 maxValue: 75, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 80, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600"]),	//Color function,
	 format: '.0f',
	 unit: '',
	 legend: { translateX: 100, translateY: 40 }
	};
    
    
	let maxValue = 0;
    
     
    // Define the div for the tooltip
    var tooltip2 = d3.select("#radar").append("div") 
            .attr("class", "tooltip2")       
            .style("opacity", 0);
    
	//Create the container SVG and g
	const parent = d3.select(".container");

	//Remove whatever chart with the same id/class was present before
	parent.select("#radar").remove();

	//Initiate the radar chart SVG
	var svgRadar = parent.append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom*3)
			.attr("class", "radar");

	//Append a g element
	var g = svgRadar.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

	// Draw the Circular grid 
    //Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");

    d3.json("./data/radarjson.json", function(error, data) {

        data = data[league][position]
            
    // change maxvalue 
    maxValue = 75;

	const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format(cfg.format),			 	//Formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
    
	//Scale for the radius
	const radiusScale = d3.scaleLinear()
		.range([0, radius])
		.domain([10, maxValue]);
   
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", d => radius / cfg.levels * d)
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
        .style('fill-opacity',0)
		//.style("fill-opacity", cfg.opacityCircles)
		//.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", d => -d * radius / cfg.levels)
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
       .style("font-family", "arial")
	   .attr("fill", "#737373")
	   .text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

	// Draw the axes
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
    
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => radiusScale(maxValue *1.1) * cos(angleSlice * i - HALF_PI))
		.attr("y2", (d, i) => radiusScale(maxValue* 1.1) * sin(angleSlice * i - HALF_PI))
		.attr("class", "line")
		.style("stroke", "#CDCDCD")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
        .style("font-family", "arial")
		.attr("dy", "0.5em")
		.attr("x", (d,i) => radiusScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI) + 5)
		.attr("y", (d,i) => radiusScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI) + 5)
		.text(d => d)
		//.call(wrap, cfg.wrapWidth);

	// Draw the radar chart blobs 
	//The radial line function
	var radarLine = d3.radialLine()
		.curve(d3.curveLinearClosed)
		.radius(d => radiusScale(d.value))
		.angle((d,i) => i * angleSlice);
    
	//Create a wrapper for the blobs
	var wrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");

	//Append the backgrounds
	wrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", d => radarLine(d.axes))
		.style("fill", (d,i) => cfg.color(i))
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function(d, i) {
			//Dim all blobs
			parent.selectAll(".radarArea")
				.transition().duration(500)
				.style("fill-opacity", 0);
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(500)
				.style("fill-opacity", 0.8);
		})
		.on('mouseout', () => {
			//Bring back all blobs
			parent.selectAll(".radarArea")
				.transition().duration(500)
				.style("fill-opacity", cfg.opacityArea);
		});

	//Create the outlines
	wrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d.axes); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", (d,i) => cfg.color(i))
		.style("fill", "none")
		//.style("filter" , "url(#glow)");

	//Append the circles
	wrapper.selectAll(".radarCircle")
		.data(d => d.axes)
		.enter()
		.append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", (d,i) => radiusScale(d.value) * cos(angleSlice * i - HALF_PI))
		.attr("cy", (d,i) => radiusScale(d.value) * sin(angleSlice * i - HALF_PI))
		.style("fill", (d) => cfg.color(d.id))
		.style("fill-opacity", 0.8);

	//Append invisible circles for tooltip 
	//Wrapper for the invisible circles on top
	var CircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");

	//Append a set of invisible circles on top for the mouseover pop-up
	CircleWrapper.selectAll(".radarInvisibleCircle")
		.data(d => d.axes)
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius * 1.5)
		.attr("cx", (d,i) => radiusScale(d.value) * cos(angleSlice*i - HALF_PI))
		.attr("cy", (d,i) => radiusScale(d.value) * sin(angleSlice*i - HALF_PI))
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
        
                 d3.select(this)
                    .style("opacity", 1)
                    .style("stroke","lightblue")
                    .style("stroke-width",1.5);
        
                tooltip2.transition()    
                    .duration(200)    
                    .style("opacity", .9);    
                
                tooltip2.html(d.value + cfg.unit)  
                    .style("left", (d3.event.pageX) + "px")   
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style('display', 'block');  
              })      
        
		.on("mouseout", function(){
			
                d3.select(this)
                    .style("opacity", 0)
                    .style("stroke","#ffffff")
                    .style("stroke-width",1);

                        tooltip2.transition()    
                        .duration(500)    
                        .style("opacity", 0); 
                      });

    // legend, same box indicating current league and position slection    
    var legendZone = svgRadar.append('g');
    var names = data.map(el => el.name);
    
    // determine the field position to put on indicator box
    var fieldposition = ''
    if (position === 'ST'){
        var fieldposition = 'Field Position: Striker'
    }
    if (position === 'CM'){
        var fieldposition = 'Field Position: Midfielder'
    }
    if (position === 'CB'){
        var fieldposition = 'Field Position: Defender'
    }
    if (position === 'GK'){
        var fieldposition = 'Field Position: GoalKeeper'
    }
    
    var title = legendZone.append("text")
				.attr("class", "title")
				.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
				.attr("x", cfg.w - 580)
				.attr("y", -20)
				.attr("font-size", "13px")
				.attr("fill", "#404040")
                .style("font-family", "arial")
                .style("font-weight", "bold")
				.text(fieldposition);
        
    // indicate box      
    var box = svgRadar.append("rect")
       			.attr("x", 55)
       			.attr("y", 5)
       			.attr("height", 20)
       			.attr("width", fieldposition.length*6.7)
       			.style("stroke", 'blue')
       			.style("fill", "blue")
                .style('fill-opacity',0.3)
       			.style("stroke-width", 1);
    
    // legend
    var legend = legendZone.append("g")
			.attr("class", "legend")
			.attr("height", 100)
			.attr("width", 200)
			.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`);
        
    // Create rectangles markers
    legend.selectAll('rect')
		  .data(names)
		  .enter()
		  .append("rect")
		  .attr("x", cfg.w - 95)
		  .attr("y", (d,i) => i * 20 - 60)
		  .attr("width", 10)
		  .attr("height", 10)
		  .style("fill", (d,i) => cfg.color(i));
            
    // Create labels
    legend.selectAll('text')
		  .data(names)
		  .enter()
		  .append("text")
		  .attr("x", cfg.w - 80)
		  .attr("y", (d,i) => i * 20 - 50)
		  .attr("font-size", "11px")
          .style("font-family", "arial")
		  .attr("fill", "#737373")
		  .text(d => d);
	
	//return svg;
    });
}