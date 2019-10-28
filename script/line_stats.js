// define margin, height, width 
var margin2 = {
        top2: 20,
        right2: 80,
        bottom2: 30,
        left2: 50
      },
      width2 = 900 - margin2.left2 - margin2.right2,
      height2 = 300 - margin2.top2 - margin2.bottom2;

// define axis and range for axis 
var x2 = d3.scaleBand().range([0, width2]).paddingInner(0.4).paddingOuter(0.4);

var y2 = d3.scaleLinear().range([height2, 0]);

// this is color for different lines 
var color2 = d3.scaleOrdinal(d3.schemeCategory10); 

var xAxis2 = d3.axisBottom().scale(x2)

var yAxis2 = d3.axisLeft().scale(y2)

// define line
var line2 = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) {
              return x2(d.Age);
            })
            .y(function(d) {
              return y2(d.stat);
            });

// define svg variable 
var svgLine2 = d3.select("#multilinestats").append("svg")
      .attr("width", width2 + margin2.left2 + margin2.right2)
      .attr("height", height2 + margin2.top2 + margin2.bottom2)
      .append("g")
      .attr("transform", "translate(" + margin2.left2 + "," + margin2.top2 + ")");

// function to redraw line chart upon selection 
function DrawMultiLine_stats(position2){
     
      position2 = './data/' + position2
    
      d3.tsv(position2, function(error, data2) {
          //if (error) throw error;
          
          //console.log(data2)
          //console.log('position:' + position2)
    // grab non date keys 
    color2.domain(d3.keys(data2[0]).filter(function(key) {
      return key !== "Age";
        
    }));

    // grab x,y values for top 5 and other   
    var originData2 = color2.domain().map(function(name) {
      return {
        name: name,
        values: data2.map(function(d) {
          return {
            Age: d.Age,
            stat: +d[name]
          };
        })
      };
    });

    // filter out, only need stats
    var stats2 = originData2.slice(0);
          stats2.splice(2,1)
          stats2.splice(4,1)
          console.log(stats2)
    
    // give domain to axis 
    x2.domain(data2.map(function(d) { return d.Age; }));

    y2.domain([
      d3.min(stats2, function(c) {
        return d3.min(c.values, function(v) {
          return v.stat;
        });
      }),
      d3.max(stats2, function(c) {
        return d3.max(c.values, function(v) {
          return v.stat;
        });
      })
    ]);
          
     // remove all before drawing again
    //var r = d3.selectAll('.legendbox2');
    //    r = r.remove();
    var lb = d3.selectAll('.label2')
        lb = lb.remove();
    var lt = d3.selectAll('.title2')
        lt = lt.remove();
    var yt = d3.selectAll('.ytitle2')
        yt = yt.remove();
    var xt = d3.selectAll('.xtitle2')
        xt = xt.remove();    
   // var t = d3.selectAll('.legendtext2');
    //    t = t.remove();
    var c = d3.selectAll('.circle2');
        c = c.remove();
    var l = d3.selectAll('.path2')
        l = l.remove();
    var lg = d3.selectAll('.league2')
        lg = lg.remove()
    var xa = d3.selectAll('.xaxis2')
        xa = xa.remove();
    var ya = d3.selectAll('.yaxis2')
        ya = ya.remove();
   
    var m1 = d3.selectAll('.mouse-over-effects2')
        m1 = m1.remove();
    var m2 = d3.selectAll('.mouse-per-line')
        m2 = m2.remove();  
    var m3 = d3.selectAll('.mouse-line2')
        m3 = m3.remove();  
  
    // lenged
    var legend2 = svgLine2.selectAll('g')
      .data(stats2)
      .enter()
      .append('g')
      .attr('class', 'legend2');
    
    // legend box
    legend2.append('rect')
      .attr("class","legendbox2")
      .attr('x', width2 - 20)
      .attr('y', function(d, i) {
        return i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return color2(d.name);
      });

    // legend words
    legend2.append('text')
      .attr("class","legendtext2")
      .attr("font-size", "10px")
      .attr('x', width2 - 8)
      .attr('y', function(d, i) {
        return (i * 20) + 9;
      })
      .text(function(d) {
        return d.name;
      });
    
    // draw the axis
    svgLine2.append("g")
      .attr("class", "xaxis2")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

    svgLine2.append("g")
      .attr("class", "yaxis2")
      .call(yAxis2)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
    
    // y axis title 
    svgLine2.append("text")
              //.attr("transform", "rotate(-90)")
              .attr('class','ytitle2')
              .attr("y", -20)
              .attr("x",5)
              .attr("dy", "1em")
              .style("fill",'#9f0000')
              .style("text-anchor", "middle")
              .style("font-family",'"Lato", sans-serif')
              .style("font-size","12px")
              .text("Stats Point ");   
          
    // x-axis label
    svgLine2.append("text") 
             .attr('class','xtitle2')
             .attr("transform","translate(" + (width2/2) + " ," + 
                (height2+25) + ")")
             .style("text-anchor", "middle")
             .style("font-family",'"Lato", sans-serif')
             .style("font-size","12px")
             .style("fill",'#9f0000')
             .text("Age");
      
    // start to draw the lines       
    var league2 = svgLine2.selectAll(".league")
      .data(stats2)
      .enter().append("g")
      .attr("class", "league2");
          
    league2.append("path")
      .attr('class','path2')
      .attr("class", "line2")
      .attr("d", function(d) {
        return line2(d.values);
      })
      .style("stroke", function(d) {
        return color2(d.name);
      });
    
    // mouse interaction 
    var mouseG = svgLine2.append("g")
      .attr("class", "mouse-over-effects");
    
    // this is the black vertical line to follow mouse
    mouseG.append("path") 
      .attr("class", "mouse-line2")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    // variable to get class of current mouse 
    var lines2 = document.getElementsByClassName('line2');
          
    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(stats2)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");
          
    // add circle at point of hover 
    mousePerLine.append("circle")
      .attr('class','c')
      .attr("r", 7)
      .style("stroke", function(d) {
        return color2(d.name);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");
    
    // add text at point of hover 
    mousePerLine.append("text")
      .attr('class','d')
      .attr("transform", "translate(10,3)");

    // append rect to catch mouse movements on canvas
    // because cant catch mouse events on a g element
    mouseG.append('svg:rect') 
      .attr('width', width2) 
      .attr('height', height2)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line2")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line2")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line2")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height2;
            d += " " + mouse[0] + "," + 0;
            return d;
          });
        
        // find the actual values as mouse hovers over, using a invert technic 
        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            //console.log(width/mouse[0])
            //var xDate = x.invert(mouse[0]),
              var xDate = scaleBandInvert(x2)(mouse[0]);
                bisect = d3.bisector(function(d) { return d.Age; }).right;
                idx = bisect(d.values, xDate);
            
            //console.log(lines2[i])
            var beginning = 0,
                end = lines2[i].getTotalLength(),
                target = null;
            
            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines2[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .text(y2.invert(pos.y).toFixed(2));
              
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
