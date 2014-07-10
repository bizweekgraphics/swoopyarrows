function swoopyArrow() {

  // "private" variables
  var from = false,
      to = false,
      degrees = 90,
      clockwise = true,
      parent = false,
      path = false,
      pathData = false;

  // drawing function, to be returned
  // typically selection will just be one group with no data, a la d3 svg axes?
  function arrow(selection) {
    // (re)draw arrow
    selection.each(function (data) {

      // save this as parent
      parent = this;

      // find offsets to correct for, y'know, conflicting reference frames or w/e
      svgOffset = parent.getBoundingClientRect();
      pageOffset = { "top": window.pageYOffset || document.documentElement.scrollTop,
                     "left": window.pageXOffset || document.documentElement.scrollLeft };

      // get eligible candidate anchor points, from which we'll select the closest two
      var fromCorners = getCorners(from),
          toCorners = getCorners(to),
          fromClosest, // for the selected candidate 'from' anchor
          toClosest,   // for the selected candidate 'to' anchor
          d;           // for the distance between the two selected candidates

      // check all possible combinations of eligible endpoints for the shortest distance
      fromCorners.forEach(function(from) {
        toCorners.forEach(function(to) {
          if(d == null || hypotenuse( to.x-from.x, to.y-from.y ) < d) {
            d = hypotenuse( to.x-from.x, to.y-from.y );
            fromClosest = from;
            toClosest = to;
          }
        });
      });

      /*
      FIRST, compute radius of circle from desired degrees for arc to subtend.
        read up:  http://mathworld.wolfram.com/Chord.html
              http://www.wolframalpha.com/input/?i=angle+subtended
        n.b.:  bizweek only uses circular arcs, but SVG allows for any ellipse, so r1 == r2 in SVG path below
            bizweek arrows typically subtend 90 or 180 degrees
      */

      // bound acceptable {degrees}, between 1 and 359
      degrees = Math.min(Math.max(degrees, 1), 359);

      // get the chord length ("height" {h}) between points
      var h = hypotenuse(toClosest.x-fromClosest.x-pageOffset.left, toClosest.y-fromClosest.y-pageOffset.top)

      // get the distance at which chord of height h subtends {angle} degrees
      var radians = degrees * Math.PI/180;
      var d = h / ( 2 * Math.tan(radians/2) );

      // get the radius {r} of the circumscribed circle
      var r = hypotenuse(d, h/2)

      /*
      SECOND, compose the corresponding SVG arc.
        read up: http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
        example: <path d = "M 200,50 a 50,50 0 0,1 100,0"/>
                            M 200,50                          Moves pen to (200,50);
                                     a                        draws elliptical arc;
                                       50,50                  following a degenerate ellipse, r1 == r2 == 50;
                                                              i.e. a circle of radius 50;
                                             0                with no x-axis-rotation (irrelevant for circles);
                                               0,1            with large-axis-flag=0 and sweep-flag=1 (clockwise);
                                                   100,0      to a point +100 in x and +0 in y, i.e. (300,50).

      */
      pathData =  "M " + (fromClosest.x-svgOffset.left) + "," + (fromClosest.y-svgOffset.top)
               + " a " + r + "," + r
               + " 0 0," + (clockwise ? "1" : "0") + " "
               + (toClosest.x-fromClosest.x-pageOffset.left) + "," + (toClosest.y-fromClosest.y-pageOffset.top);

      // if it doesn't exist yet, define arrowhead marker
      if(d3.select("defs marker#arrowhead").empty()) loadMarker(parent);

      // if it doesn't exist yet, append the path
      if(!path) {
        path = d3.select(parent)
          .append("path")
            .attr("marker-end", "url(#arrowhead)")
            .attr("class", "arrow");
      }

      // update the path
      path.attr("d", pathData);

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
  function hypotenuse(a, b) {
    return Math.sqrt( Math.pow(a,2) + Math.pow(b,2) );
  }

  function loadMarker(parent) {
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
        .attr("points", "-6.75,-6.75 0,0 -6.75,6.75");
  }

  // GETTERS & SETTERS

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

  arrow.pathData = function() {
    return pathData;
  }

  // return drawing function
  return arrow;
}
