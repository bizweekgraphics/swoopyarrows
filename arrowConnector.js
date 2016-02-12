/*

OK so this is a script I wrote so that producers didn't have to 
write javascript, they could just use data attributes to get
arrows on the page. It is bad but the find-nearest-corners-or-
edges-of-two-bounding-boxes bit is interesting and should be
factored out. Maybe not part of a module, maybe just a nice lil
copy-pastable utility in the demo.

*/

'use strict';

function arrowConnector() {

  var svg, arrows;

  var lineTypes = {
    "straight": d3.svg.line().x(ƒ('x')).y(ƒ('y')),
    "swoopy": d3.svg.swoopy().angle(Math.PI/4).x(ƒ('x')).y(ƒ('y')),
    "kooky": d3.svg.kooky().steps(5).deviation(100).x(ƒ('x')).y(ƒ('y')),
    "loopy": d3.svg.loopy().steps(30).radius(20).x(ƒ('x')).y(ƒ('y')),
    "random": randLine
  }

  function randLine() {
    var lineTypeKeys = Object.keys(lineTypes);
    var lineTypeIndex = Math.floor(Math.random()*lineTypeKeys.length);
    return lineTypes[lineTypeKeys[lineTypeIndex]].apply(this, arguments);
  }

  // config vars
  var lineType = 'random',
      considerCorners = false,
      considerEdges = true;

  // duration? inherit transitions?
  // render takes a selection?

  function render() {

    if(d3.select(".arrow-connector-container").empty()) {
      svg = d3.select("body").append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .classed("arrow-connector-container", true)
        .style("position", "absolute")
        .style("top", "0")
        .style("left", "0")
        .style("width", "100%")
        .style("height", "100%")
        .style("overflow", "visible")
        .style("pointer-events", "none");
      
      // arrowhead def
      svg.append('defs')
        .append("marker")
          .attr("id", "arrowhead")
          .attr("viewBox", "-10 -10 20 20")
          .attr("refX", 0)
          .attr("refY", 0)
          .attr("markerWidth", 20)
          .attr("markerHeight", 20)
          .attr("stroke-width", 1)
          .attr("orient", "auto")
        .append("polyline")
          .attr("stroke-linejoin", "bevel")
          .attr("points", "-6.75,-6.75 0,0 -6.75,6.75");

    } else {
      svg = d3.select(".arrow-connector-container");
    }

    arrows = svg.selectAll("path")
      .data(getTargets(getPairs(d3.select("body"))));

    arrows.enter()
      .append("path")
      .classed("arrow-connector", true)
      .attr("d", lineTypes[lineType])
      .attr('marker-end', 'url(#arrowhead)')
      .style('opacity', 0)
      .style('stroke-dasharray', function() { return this.getTotalLength(); })
      .style('stroke-dashoffset', function() { return this.getTotalLength(); })
      .each(function(d,i) {
        var arrow = this;
        d.forEach(function(dd,ii) {
          d3.select(dd.ref)
            .datum({'arrow': arrow})
            .on('animationend', function(ddd,iii) { 
              d3.select(d3.select(this).datum().arrow)
                .transition()
                .duration(500)
                .style('opacity', 1)
                .style('stroke-dashoffset', 0);
            });
        })
      });

    // update selection
    // (weird hack: reads opacity style to infer how far along the intro transition is)
    arrows
      .attr("d", lineTypes[lineType])
      .style('stroke-dasharray', function() { return this.getTotalLength(); })
      .style('stroke-dashoffset', function() { return (1 - d3.select(this).style('opacity')) * this.getTotalLength(); });

  }

  function getPairs(sel) {
    var pairs = [];
    sel.selectAll("[data-arrow-target]")
      .each(function(d,i) {
        var from = this;
        d3.selectAll(this.dataset.arrowTarget).each(function(dd,ii) {
          var to = this;
          pairs.push([from,to]);
        });
      });
    return pairs;
  }

  function getTargets(elementPairs) {
    var targets = [];
    elementPairs.forEach(function(pair) {

      var fromCandidates = [];
      var toCandidates = [];

      if(considerEdges) {
        fromCandidates = fromCandidates.concat(getEdges(pair[0]));
        toCandidates = toCandidates.concat(getEdges(pair[1]));
      }

      if(considerCorners) {
        fromCandidates = fromCandidates.concat(getCorners(pair[0]));
        toCandidates = toCandidates.concat(getCorners(pair[1]));
      }

      // debugger

      // check all possible combinations of eligible endpoints for the shortest distance
      var fromClosest, toClosest, distance;
      fromCandidates.forEach(function(from) {
        toCandidates.forEach(function(to) {
          if(distance == null || hypotenuse( to.x-from.x, to.y-from.y ) < distance) {
            distance = hypotenuse( to.x-from.x, to.y-from.y );
            fromClosest = from;
            toClosest = to;
          }
        });
      });

      targets.push([fromClosest,toClosest]);
    })
    return targets;
  }

  // gets from the sides of a bounding rect (left, right, top, bottom)
  // to its corners (topleft, topright, bottomleft, bottomright)
  function getCorners(element) {
    var corners = [];
    ["left","right"].forEach(function(i) { ["top","bottom"].forEach(function(j) { corners.push({"x":i,"y":j}); }); });
    return corners.map(function(corner) {
      return {
        "x": element.getBoundingClientRect()[corner.x] + window.pageXOffset,
        "y": element.getBoundingClientRect()[corner.y] + window.pageYOffset,
        "ref": element
      };
    });
  }

  // get the midpoints of the four edges of a box — inelegant but readable!
  // (lmk when you seriously need to generalize to n-gons in m dimensions...)
  function getEdges(el) {
    var box = el.getBoundingClientRect();
    var edges = [
      {
        "x": box.left,
        "y": (box.top + box.bottom) / 2
      },
      {
        "x": box.right,
        "y": (box.top + box.bottom) / 2
      },
      {
        "x": (box.left + box.right) / 2,
        "y": box.top
      },
      {
        "x": (box.left + box.right) / 2,
        "y": box.bottom
      }
    ];
    edges.forEach(function(edge) {
      edge.x += window.pageXOffset;
      edge.y += window.pageYOffset;
      edge.ref = el;
    });
    return edges;
  }

  function hypotenuse(a, b) {
    return Math.sqrt( Math.pow(a,2) + Math.pow(b,2) );
  }

  render.edges = function(_) {
    if (!arguments.length) return considerEdges;
    considerEdges = _;
    return render;
  };

  render.corners = function(_) {
    if (!arguments.length) return considerCorners;
    considerCorners = _;
    return render;
  };

  render.type = function(_) {
    if (!arguments.length) return lineType;
    lineType = _;
    return render;
  };

  return render;

}
