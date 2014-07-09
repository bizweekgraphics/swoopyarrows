function swoopyArrow() {
  'use strict';

  function points(d) {
    return {
      x: d[0],
      y: d[1]
    }
  }

  var from = points,
      to = points,
      degrees = Math.PI,
      clockwise = true

  function arrow(data) {
    // get the chord length ("height" {h}) between points
    var h = hypotenuse(to(data.to).x-from(data.from).x, to(data.to).y-from(data.from).y)

    // get the distance at which chord of height h subtends {angle} degrees
    var d = h / ( 2 * Math.tan(degrees / 2) );

    // get the radius {r} of the circumscribed circle
    var r = hypotenuse(d, h/2)

    console.log('h', h)
    console.log('d', d)
    console.log('degrees', degrees)
    console.log('data', data)

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
    var path =  "M " + from(data.from).x + "," + from(data.from).y
         + " a " + r + "," + r
         + " 0 0," + (clockwise ? "1" : "0") + " "
         + (to(data.to).x-from(data.from).x) + "," + (to(data.to).y-from(data.from).y);

    return path
  }

  // PRIVATE FUNCTIONS

  // this seems good to have
  function hypotenuse(a, b) {
    return Math.sqrt( Math.pow(a,2) + Math.pow(b,2) );
  }

  // GETTERS & SETTERS

  arrow.from = function(_) {
    if (!arguments.length) return from;
    from = _;
    return arrow;
  };

  arrow.to = function(_) {
    if (!arguments.length) return to;
    to = _;
    return arrow;
  };

  arrow.degrees = function(_) {
    if (!arguments.length) return degrees;
    degrees = Math.min(Math.max(_, 1e-6), Math.PI-1e-6);
    console.log('woo', degrees)
    return arrow;
  };

  arrow.clockwise = function(_) {
    if (!arguments.length) return clockwise;
    clockwise = !!_;
    return arrow;
  };

  // return drawing function
  return arrow;
}
