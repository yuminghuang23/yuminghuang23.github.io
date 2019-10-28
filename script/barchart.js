// define width height 
var width = 1200;
var height = window.innerHeight*0.3;

// set maxvalue for y axis 
var maxValue = 400;

var margin = {
    top: 40,
    left: 30,
    right: 30,
    bottom: 30
};

// set up svg canvas 
var svgBar = d3.select("#vis")
    .append("svg")
    .attr('width', width)
    .attr('height', height)
    .append("g")
    .attr("transform", "translate(" + 30 + "," + margin.left + ")");
    //.attr("transform", "translate(" + margin.top + "," + margin.left + ")");

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

// for the axis range and type 
var yscale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, maxValue]);

var xscale = d3.scaleBand().
    range([0, width])
    .paddingInner(0.4)
    .paddingOuter(0.4);

// duration for animation 
var duration = 1000;

var xaxis = d3.axisBottom(xscale);

var yaxis = d3.axisLeft(yscale);

// set up axis 
svgBar.append('g')
    .attr('transform', 'translate(0, ' + (height) + ')')
    .attr('class', 'x axis');

svgBar.append('g')
    .attr('class', 'y axis');

// function to redraw bar chart on selection 
function update(file) {
    
    // decide which file to retrieve data
    var filename = './data/' + file + '.csv'
    
    d3.csv(filename, function(data){
        
        // same as before 
        var width = 1200;
        var height = window.innerHeight*0.3;

        var margin = {
            top: 40,
            left: 30,
            right: 30,
            bottom: 30
        };
        
        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        xscale.domain(data.map(function(d) { return d.name; }));

        yscale.domain([0, data[0].count]);
        
        // set up bars
        var bars = svgBar.selectAll(".bar")
            .data(data);
        
        // start to draw bars
        bars
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr("fill", "	#FFA07A")
            .attr('width', xscale.bandwidth())
            .attr('height', 0)
            .attr('y', height)
            .merge(bars)
            .transition()
            .duration(duration)
            .attr("height", function(d, i) {
                return height - yscale(d.count);
            })
            .attr("y", function(d, i) {
                return yscale(d.count);
            })
            .attr("width", xscale.bandwidth())
            .attr("x", function(d, i) {
                return xscale(d.name);
            })

        // for the bar animation 
        bars
            .exit()
            .transition()
            .duration(duration)
            .attr('height', 0)
            .attr('y', height)
            .remove();
        
        // labels above bars
        var labels = svgBar.selectAll('.label')
            .data(data);

        var new_labels = labels
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('opacity', 0)
            .attr('y', height)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')

        new_labels.merge(labels)
            .transition()
            .duration(duration)
            .attr('opacity', 1)
            .attr('x', function(d, i) {
                return xscale(d.name) + xscale.bandwidth() / 2;
            })
            .attr('y', function(d) {
                return yscale(d.count);
            })
            .text(function(d) {
                return d.count;
            });
        
        // animation for labels
        labels
            .exit()
            .transition()
            .duration(duration)
            .attr('y', height)
            .attr('opacity', 0)
            .remove();
        
        // draw axis and animation  
        svgBar.select('.x.axis')
            .transition()
            .duration(duration)
            .call(xaxis);

        svgBar.select('.y.axis')
            .transition()
            .duration(duration)
            .call(yaxis);

        // y axis title
        svgBar.append("text")
                  //.attr("transform", "rotate(-90)")
                  .attr("y", -30)
                  .attr("x",5)
                  .attr("dy", "1em")
                  .style("fill",'#9f0000')
                  .style("text-anchor", "middle")
                  .style("font-family",'"Lato", sans-serif')
                  .style("font-size","12px")
                  .text("No.of players");  

        // x-axis label
        svgBar.append("text")             
                 .attr("transform","translate(" + (width/2) + " ," + 
                    (height+30) + ")")
                 .style("text-anchor", "middle")
                 .style("font-family",'"Lato", sans-serif')
                 .style("font-size","12px")
                 .style("fill",'#9f0000')
                 .text("Country of Origin");


        })
}


