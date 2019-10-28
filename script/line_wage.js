// define margin, height, width 
var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
      },
      width = 900 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
// define axis and range for axis 
var x = d3.scaleBand().range([0, width]).paddingInner(0.4).paddingOuter(0.4);

var y = d3.scaleLinear().range([height, 0]);

// this is color for different lines 
var color = d3.scaleOrdinal(d3.schemeCategory10); 

var xAxis = d3.axisBottom().scale(x)

var yAxis = d3.axisLeft().scale(y)

// define line
var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) {
              return x(d.Age);
            })
            .y(function(d) {
              return y(d.wage);
            });
// define svg variable       
var svgLine = d3.select("#multilinewage").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// function to redraw line chart upon selection 
function DrawMultiLine_wage(position){
    
      position = './data/' + position
    
      d3.tsv(position, function(error, data) {
          if (error) throw error;
          
          //console.log(data)
    
    // grab non date keys 
    color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "Age";
        
    }));

    // grab x,y values for top 5 and other   
    var originData = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {
            Age: d.Age,
            wage: +d[name]
          };
        })
      };
    });
    
    // // filter out, only need wage
    var wages = originData.slice(0);
          //console.log(originData)
          // remove stats, only keep wage
          wages.splice(0,2)
          wages.splice(1,2)
          //console.log(wages)

    // stats, not used here 
    var stats = originData.slice(0);
          stats.splice(2,1)
          stats.splice(4,1)
          //console.log(stats)
    
    // give domain to axis 
    x.domain(data.map(function(d) { return d.Age; }));

    y.domain([
      d3.min(wages, function(c) {
        return d3.min(c.values, function(v) {
          return v.wage;
        });
      }),
      d3.max(wages, function(c) {
        return d3.max(c.values, function(v) {
          return v.wage;
        });
      })
    ]);
      
     // remove all before drawing again
    var r = d3.selectAll('legendbox');
        r = r.remove();
    var lb = d3.selectAll('.label')
        lb = lb.remove();
    var lt = d3.selectAll('.title')
        lt = lt.remove();
    var yt = d3.selectAll('.ytitle')
        yt = yt.remove();
    var xt = d3.selectAll('.xtitle')
        xt = xt.remove();    
    var t = d3.selectAll('legendtext');
        t = t.remove();
    var c = d3.selectAll('circle');
        c = c.remove();
    var l = d3.selectAll('path')
        l = l.remove();
    var lg = d3.selectAll('.league')
        lg = lg.remove()
    var xa = d3.selectAll('.xaxis')
        xa = xa.remove();
    var ya = d3.selectAll('.yaxis')
        ya = ya.remove();
   
    var m1 = d3.selectAll('.mouse-over-effects')
        m1 = m1.remove();
    var m2 = d3.selectAll('.mouse-per-line2')
        m2 = m2.remove();   
    var m3 = d3.selectAll('.mouse-line')
        m3 = m3.remove();  
         
    // lenged
    var legend = svgLine.selectAll('g')
      .data(wages)
      .enter()
      .append('g')
      .attr('class', 'legend');
          
    // legend box     
    legend.append('rect')
      .attr("class","legendbox")
      .attr('x', width - 20)
      .attr('y', function(d, i) {
        return i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return color(d.name);
      });
          
    // legend words
    legend.append('text')
      .attr("class","legendtext")
      .attr("font-size", "10px")
      .attr('x', width - 8)
      .attr('y', function(d, i) {
        return (i * 20) + 9;
      })
      .text(function(d) {
        return d.name;
      });
    
    // add line svg       
    svgLine.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svgLine.append("g")
      .attr("class", "yaxis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
    
    // y axis title 
    svgLine.append("text")
              //.attr("transform", "rotate(-90)")
              .attr('class','ytitle')
              .attr("y", -20)
              .attr("x",5)
              .attr("dy", "1em")
              .style("fill",'#9f0000')
              .style("text-anchor", "middle")
              .style("font-family",'"Lato", sans-serif')
              .style("font-size","12px")
              .text("Wage €");   
          
    // x-axis label
          svgLine.append("text") 
             .attr('class','xtitle')
             .attr("transform","translate(" + (width/2) + " ," + 
                (height+25) + ")")
             .style("text-anchor", "middle")
             .style("font-family",'"Lato", sans-serif')
             .style("font-size","12px")
             .style("fill",'#9f0000')
             .text("Age");
    
    // draw line
    var league = svgLine.selectAll(".league")
      .data(wages)
      .enter().append("g")
      .attr("class", "league");
 
    league.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
        return line(d.values);
      })
      .style("stroke", function(d) {
        return color(d.name);
      });
    
    // for displaying the blue box indicating current selected position 
    var fieldposition = ''
    if(position === 'ST_wage.tsv'){
        fieldposition = 'Field Position: Striker'
    }
    if(position === 'CM_wage.tsv'){
        fieldposition = 'Field Position:Midfielder'
    }
    if(position === 'CB_wage.tsv'){
        fieldposition = 'Field Position:Defender'
    }
    if(position === 'GK_wage.tsv'){
        fieldposition = 'Field Position:Goalkeeper'
    }
          
    var box = svgLine.append("rect")
                .attr("class", "label")
       			.attr("x", width/20)
       			.attr("y", -20)
       			.attr("height", 20)
       			.attr("width", fieldposition.length*6.7)
       			.style("stroke", 'blue')
       			.style("fill", "blue")
                .style('fill-opacity',0.3)
       			.style("stroke-width", 1);
          
    var title = svgLine.append("text")
				.attr("class", "title")
				//.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
				.attr("x", width/19)
				.attr("y", -6)
				.attr("font-size", "13px")
				.attr("fill", "#404040")
                .style("font-family", "arial")
                .style("font-weight", "bold")
				.text(fieldposition);
          
    // mouse interaction 
    var mouseG = svgLine.append("g")
      .attr("class", "mouse-over-effects");
    
     // this is the black vertical line to follow mouse
    mouseG.append("path") 
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
    
    // variable to get class of current mouse 
    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line2')
      .data(wages)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line2");
          
    // add circle at point of hover 
    mousePerLine.append("circle")
      .attr('class','a')
      .attr("r", 7)
      .style("stroke", function(d) {
        return color(d.name);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    // add text at point of hover 
    mousePerLine.append("text")
      .attr('class','b')
      .attr("transform", "translate(10,3)");

    // append rect to catch mouse movements on canvas
    // because cant catch mouse events on a g element
    mouseG.append('svg:rect') 
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line2 circle").filter('.a')
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line2 text").filter('.b')
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line2 circle").filter('.a')
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line2 text").filter('.b')
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        // find the actual values as mouse hovers over, using a invert technic 
        d3.selectAll(".mouse-per-line2")
          .attr("transform", function(d, i) {
            //console.log(width/mouse[0])
            //var xDate = x.invert(mouse[0]),
              var xDate = scaleBandInvert(x)(mouse[0]);
                bisect = d3.bisector(function(d) { return d.wage; }).right;
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2));
              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });
    
    // function for invert scaleBand 
      function scaleBandInvert(scale) {
          var domain = scale.domain();
          var paddingOuter = scale(domain[0]);
          var eachBand = scale.step();
          return function (value) {
            var index = Math.floor(((value - paddingOuter) / eachBand));
            return domain[Math.max(0,Math.min(index, domain.length-1))];
          }
      }
          
      });
    }

