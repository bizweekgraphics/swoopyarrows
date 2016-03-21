swoopyarrows.js
===============

> Out of the crooked timber of JavaScript, no straight arrow was ever made.  
*— Immanuel Kant*

Finally an open source project to match the scope of our ambition! A family of three path generators for making nice fun arrows. Use it more or less like [`d3.svg.line`](https://github.com/mbostock/d3/wiki/SVG-Shapes#line); the easiest thing is to just pass an array of two points, like `[[0,0],[10,30]]`. Each has `x` and `y` accessors and a couple other options.

[Download](https://github.com/bizweekgraphics/swoopyarrows/raw/master/swoopyArrows.js), [demo](http://www.bizweekgraphics.com/swoopyarrows/), [demo source](https://github.com/bizweekgraphics/swoopyarrows/blob/master/index.html). 

The only dependency is [d3 v3](http://d3js.org). But it goes great with [d3-jetpack](https://github.com/gka/d3-jetpack)! If you’re trying to annotate a bunch of things, you may also have more luck with Adam Pearce’s [swoopyDrag](http://1wheel.github.io/swoopy-drag/). 

Bring your own SVG markers. We typically use this simple arrowhead:

```
<marker id="arrowhead" viewBox="-10 -10 20 20" refX="0" refY="0" markerWidth="20" markerHeight="20" stroke-width="1" orient="auto"><polyline stroke-linejoin="bevel" points="-6.75,-6.75 0,0 -6.75,6.75"></polyline></marker>
```

## swoopyArrow

[Download](https://github.com/bizweekgraphics/swoopyarrows/raw/master/swoopyArrow.js). Connect points with circular arcs. The classic. Set `angle` to the angle the arrow should subtend, in radians, between `0` (basically straight) and `Math.PI` (a semicircle, 180º). It's not currently possible to subtend more than that.

```javascript
var swoopy = swoopyArrow()
  .angle(Math.PI/4)
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });

svg.append("path")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([[100,200],[300,400]])
  .attr("d", swoopy);
```

## loopyArrow

[Download](https://github.com/bizweekgraphics/swoopyarrows/raw/master/loopyArrow.js). Like a coiled telephone cord. Set the radius of the loop with `radius`; increase `steps` to add more coils — although it's only _proportionate_ to the number of loops, not equal to, because I am bad at math and lazy.

```javascript
var loopy = loopyArrow()
  .steps(30)
  .radius(20)
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });

svg.append("path")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([[400,600],[800,100]])
  .attr("d", loopy);
```

## kookyArrow

[Download](https://github.com/bizweekgraphics/swoopyarrows/raw/master/kookyArrow.js). Follows a random path between two points. Increase `steps` to add more kinks; increase `deviation` to make the kinks deviate more from the path.

```javascript
var kooky = kookyArrow()
  .steps(5)
  .deviation(100)
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });

svg.append("path")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([[1000,200],[700,600]])
  .attr("d", kooky);
```

----

For an idea of how you might use the `x` and `y` accessors — you could set them to get the `offsetLeft` and `offsetTop` of DOM elements, so you can just pass an array of two DOM elements and generate an arrow between them:

```javascript
var swoopBetweenElements = swoopyArrow()
  .angle(Math.PI/4)
  .x(function(d) { return d.offsetLeft; })
  .y(function(d) { return d.offsetTop; });

svg.append("path")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([document.querySelector('h1'), document.querySelector('h2')])
  .attr("d", swoopBetweenElements);
```

----

## To-do

- Handle passing in more than two points (go through all three? choose the closest two?)
- Put together a bunch of Adobe Illustrator-style SVG markers
- The whole thing should just be a [d3-shape custom curve](https://github.com/d3/d3-shape#custom-curves) module
- [Add droopy catenaries](https://github.com/bizweekgraphics/swoopyarrows/issues/25)

----

> Swoopy arrows have been in use since Egyptian hieroglyphics. They belong to [no one](https://github.com/bizweekgraphics/swoopyarrows/blob/master/LICENSE) ↪↺↷⟲⤣⤥⤴⤵⤶⤷⤹⤳⤻⤿⤺  
— *[Jennifer Daniel](https://twitter.com/jenniferdaniel/status/464517373740204032), patron saint*

![Prior art](https://raw.githubusercontent.com/bizweekgraphics/swoopyarrows/master/priorart.jpg)
