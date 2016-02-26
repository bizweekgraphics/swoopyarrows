function kookyArrow() {

  var steps = 5,
      mean = 0,
      deviation = 100,
      interpolate = 'basis',
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; };

  function render(data) {

    if(data.length < 2) return;

    data = data.map(function(d, i) {
      return [xValue.call(data, d, i), yValue.call(data, d, i)];
    });

    var rng = d3.random.normal(mean, deviation);
    var line = d3.svg.line().interpolate(interpolate);

    var points = [];

    points.push(data[0]);
    data.slice(1).forEach(function(d1,i) {
      var d0 = data[i];
      d3.range(steps).slice(1).forEach(function(numerator) {
        var cx = d0[0] + (numerator/steps) * (d1[0]-d0[0]);
        var cy = d0[1] + (numerator/steps) * (d1[1]-d0[1]);

        if(numerator < steps-1) {
          cx += rng();
          cy += rng();
        }

        points.push([cx, cy])
      })
    });
    points.push(data[data.length-1]);

    return line(points);

  }

  render.steps = function(_) {
    if (!arguments.length) return steps;
    steps = _;
    return render;
  }

  render.deviation = function(_) {
    if (!arguments.length) return deviation;
    deviation = _;
    return render;
  }

  render.interpolate = function(_) {
    if (!arguments.length) return interpolate;
    interpolate = _;
    return render;
  }

  render.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return render;
  };

  render.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return render;
  };

  return render;

}
