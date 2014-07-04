function swoopyArrow() {

  // "private" variables
  var parent = false,
      from = false,
      to = false,
      degrees = 90,
      clockwise = true;

  // drawing function, to be returned
  function arrow(selection) {
    // typically selection will just be one group with no data, a la d3 svg axes?
    selection.each(function (data) {
      // (re)draw arrow

      var fromCorners = getCorners(from),
          toCorners = getCorners(to),
          fromClosest, toClosest, d;

      // check all possible combinations of eligible endpoints for the shortest distance
      fromCorners.forEach(function(fromVal) {
        toCorners.forEach(function(toVal) {
          if(d==null || distance(fromVal,toVal)<d) {
            d = distance(fromVal,toVal);
            fromClosest = fromVal;
            toClosest = toVal;
          }
        });
      });

      offset = parent.getBoundingClientRect();

      /*
      FIRST, compute radius of circle from desired degrees for arc to subtend.
        read up:  http://mathworld.wolfram.com/Chord.html
              http://www.wolframalpha.com/input/?i=angle+subtended
        n.b.:  bizweek only uses circular arcs, but SVG allows for any ellipse, so r1 == r2 in SVG path below
            bizweek arrows typically subtend 90 or 180 degrees
      */

      // bound acceptable {degrees}, between 1 and 359
      degrees = Math.max(degrees, 1);
      degrees = Math.min(degrees, 359);

      // get the chord length ("height" {h}) between points, by pythagorus
      var h = Math.sqrt(Math.pow((toClosest.x-fromClosest.x),2)+Math.pow((toClosest.y-fromClosest.y),2));

      // get the distance at which chord of height h subtends {angle} degrees
      var radians = degrees * Math.PI/180;
      var d = h / ( 2 * Math.tan(radians/2) );

      // get the radius {r} of the circumscribed circle
      var r = Math.sqrt(Math.pow(d,2)+Math.pow((h/2),2));

      /*
      SECOND, compose the corresponding SVG arc.
        read up: http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
        example: <path d = "M 200 50 a 90 90 0 0 1 100 0"/>
      */
      var path = "M " + (fromClosest.x-offset.left) + " " + (fromClosest.y-offset.top) + " a " + r + " " + r + " 0 0 "+(clockwise ? "1" : "0")+" " + (toClosest.x-fromClosest.x) + " " + (toClosest.y-fromClosest.y);

      // append path to given {parent} (with class .arrow)
      var arrow = d3.select(parent).append("path")
        .attr("d", path)
        .attr("marker-end", "url(#arrowhead)")
        .attr("class", "arrow");

      // if not already defined, define arrowhead marker
      if(d3.select("defs marker#arrowhead").empty()) {
        d3.select(parent).append("defs")
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
            .classed("arrow", true)
            .attr("stroke-linejoin", "bevel")
            .attr("points", "-6.72,-6.749 0.54,0 -6.72,6.749");
      }
    });
  }

  // PRIVATE FUNCTIONS

  // given a DOM element, jQuery element, or D3 selection, return a DOM element
  function getDOMElement(element) {
    if(element.nodeType) {
      // a DOM element was directly passed in
      return element;
    } else if(element.jquery) {
      // a jquery element was passed in; convert to DOM element
      return element[0];
    } else if(element instanceof d3.selection) {
      // a D3 element was passed in
      return element[0][0];
    } else {
      // element passed in isn't recognizably of a supported type
      return element;
    }
  }

  // "corners" are coordinates of points that are eligible to be connected
  function getCorners(element) {
    if(element instanceof Array && !element.data) {
      // an array hopefully containing [x,y] was passed in
      return [{"x":element[0],"y":element[1]}];
    } else {
      // something else was passed in (DOM element, jQuery element, D3 selection...);
      // attempt to normalize to DOM element and get corners
      return edgesToCorners(element);
    }
  }

  // gets from the sides of a bounding rect (left, right, top, bottom)
  // to its corners (topleft, topright, bottomleft, bottomright)
  function edgesToCorners(element) {
    var corners = [];
    ["left","right"].forEach(function(i) { ["top","bottom"].forEach(function(j) { corners.push({"x":i,"y":j}); }); });
    return corners.map(function(corner) {
      return {"x":element.getBoundingClientRect()[corner.x],
              "y":element.getBoundingClientRect()[corner.y]};
    });
  }

  // this seems good to have
  function distance(from, to) {
    return Math.sqrt(Math.pow(to.x-from.x,2)+Math.pow(to.y-from.y,2));
  }

  // GETTERS & SETTERS
  /* var parent = false,
      from = false,
      to = false,
      degrees = 90,
      clockwise = true; */

  arrow.parent = function(_) {
    if (!arguments.length) return parent;
    parent = getDOMElement(_);
    return arrow;
  };

  arrow.from = function(_) {
    if (!arguments.length) return from;
    from = getDOMElement(_);
    return arrow;
  };

  arrow.to = function(_) {
    if (!arguments.length) return to;
    to = getDOMElement(_);
    return arrow;
  };

  arrow.degrees = function(_) {
    if (!arguments.length) return degrees;
    degrees = _;
    return arrow;
  };

  arrow.clockwise = function(_) {
    if (!arguments.length) return clockwise;
    clockwise = _;
    return arrow;
  };

  // return drawing function
  return arrow;
}

function drawArrow(parent, from, to, degrees, clockwise) {
  /*
  PARAMETERS:
    parent:     the svg container or element to which to append the arrow
    from, to:   where to draw the arrow from and to, in any of four forms (in any mix):
                  a DOM element:            document.getElementById("hed")
                  a jQuery element:         $("#hed")
                  a D3 element:             d3.select("#hed")
                  a coordinate array [x,y]: [100,200]
    degrees:    the angle which the arc of the arrow will subtend.
                  90 for a gentle arc, 180 for a bigger swoop.
                  beyond 180, it gets gentler again, because of the way SVG computes arc.
                  pass 0 or 360 for a straight arrow.
    clockwise:  boolean determining whether arrow will swoop clockwise (true) or counterclockwise (false)
  */

  // ZEROTH, figure out which points to draw between, for when from and to are spatially-extended elements

  // given a DOM element, jQuery element, or D3 selection, return a DOM element
  function getDOMElement(element) {
    if(element.nodeType) {
      // a DOM element was directly passed in
      return element;
    } else if(element.jquery) {
      // a jquery element was passed in; convert to DOM element
      return element[0];
    } else if(element instanceof d3.selection) {
      // a D3 element was passed in
      return element[0][0];
    } else {
      // element passed in isn't recognizably of a supported type
      return false;
    }
  }

  // "corners" are coordinates of points that are eligible to be connected
  function getCorners(element) {
    if(element instanceof Array && !element.data) {
      // an array hopefully containing [x,y] was passed in
      return [{"x":element[0],"y":element[1]}];
    } else {
      // something else was passed in (DOM element, jQuery element, D3 selection...);
      // attempt to normalize to DOM element and get corners
      return edgesToCorners(getDOMElement(element));
    }
  }

  // gets from the sides of a bounding rect (left, right, top, bottom)
  //      to its corners (topleft, topright, bottomleft, bottomright)
  function edgesToCorners(element) {
    var corners = [];
    ["left","right"].forEach(function(i) { ["top","bottom"].forEach(function(j) { corners.push({"x":i,"y":j}); }); });
    return corners.map(function(corner) {
      return {"x":element.getBoundingClientRect()[corner.x],
              "y":element.getBoundingClientRect()[corner.y]};
    });
  }

  var fromCorners = getCorners(from),
      toCorners = getCorners(to),
      fromClosest, toClosest, d;

  // this seems good to have
  function distance(from, to) {
    return Math.sqrt(Math.pow(to.x-from.x,2)+Math.pow(to.y-from.y,2));
  }

  // check all possible combinations of eligible endpoints for the shortest distance
  fromCorners.forEach(function(fromVal) {
    toCorners.forEach(function(toVal) {
      if(d==null || distance(fromVal,toVal)<d) {
        d = distance(fromVal,toVal);
        fromClosest = fromVal;
        toClosest = toVal;
      }
    });
  });

  from = fromClosest;
  to = toClosest;

  parent = getDOMElement(parent);
  offset = parent.getBoundingClientRect();

  /*
  FIRST, compute radius of circle from desired degrees for arc to subtend.
    read up:  http://mathworld.wolfram.com/Chord.html
          http://www.wolframalpha.com/input/?i=angle+subtended
    n.b.:  bizweek only uses circular arcs, but SVG allows for any ellipse, so r1 == r2 in SVG path below
        bizweek arrows typically subtend 90 or 180 degrees
  */

  // bound acceptable {degrees}, between 1 and 359
  degrees = Math.max(degrees, 1);
  degrees = Math.min(degrees, 359);

  // get the chord length ("height" {h}) between points, by pythagorus
  var h = Math.sqrt(Math.pow((to.x-from.x),2)+Math.pow((to.y-from.y),2));

  // get the distance at which chord of height h subtends {angle} degrees
  var radians = degrees * Math.PI/180;
  var d = h / ( 2 * Math.tan(radians/2) );

  // get the radius {r} of the circumscribed circle
  var r = Math.sqrt(Math.pow(d,2)+Math.pow((h/2),2));

  /*
  SECOND, compose the corresponding SVG arc.
    read up: http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
    example: <path d = "M 200 50 a 90 90 0 0 1 100 0"/>
  */
  var path = "M " + (from.x-offset.left) + " " + (from.y-offset.top) + " a " + r + " " + r + " 0 0 "+(clockwise ? "1" : "0")+" " + (to.x-from.x) + " " + (to.y-from.y);

  // append path to given {parent} (with class .arrow)
  var arrow = d3.select(parent).append("path")
    .attr("d", path)
    .attr("marker-end", "url(#arrowhead)")
    .attr("class", "arrow");

  // if not already defined, define arrowhead marker
  if(d3.select("defs marker#arrowhead").empty()) {
    d3.select(parent).append("defs")
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
        .classed("arrow", true)
        .attr("stroke-linejoin", "bevel")
        .attr("points", "-6.72,-6.749 0.54,0 -6.72,6.749");
  }

  // return a reference to the appended arrow
  return arrow;
}
