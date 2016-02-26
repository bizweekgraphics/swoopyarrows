swoopyarrows.js
===============

> Out of the crooked timber of JavaScript, no straight arrow was ever made.  
*— Immanuel Kant*

Finally an open source project to match the scope of our ambition! A family of three path generators for making nice fun arrows. Use it more or less like `d3.svg.line`; the easiest thing is to just pass an array of two points, like `[[0,0],[10,30]]`. Each has x and y accessors and a couple other options.

The only dependency is [d3 v3](http://d3js.org). But it goes great with [d3-jetpack](https://github.com/gka/d3-jetpack)!

This is B.Y.O. SVG markers. We typically use this simple arrowhead:

```
<marker id="arrowhead" viewBox="-10 -10 20 20" refX="0" refY="0" markerWidth="20" markerHeight="20" stroke-width="1" orient="auto"><polyline stroke-linejoin="bevel" points="-6.75,-6.75 0,0 -6.75,6.75"></polyline></marker>
```

## swoopyArrow

Connect points with circular arcs. The classic.

```javascript
var swoopy = swoopyArrow()
  .angle(Math.PI/4)
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });

svg.append("path.arrow-connector")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([[100,200],[300,400]])
  .attr("d", swoopy);
```

## loopyArrow

Like a coiled telephone cord. Radius and coiling of coils configurable, though it might make more intuitive sense to parameterize its behavior differently.

```javascript
var loopy = loopyArrow()
  .steps(30)
  .radius(20)
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });

svg.append("path.arrow-connector")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([[400,600],[800,100]])
  .attr("d", loopy);
```

## kookyArrow

Follows a random path between two points. :)

```javascript
var kooky = kookyArrow()
  .steps(5)
  .deviation(100)
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });

svg.append("path.arrow-connector")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([[1000,200],[700,600]])
  .attr("d", kooky);
```

----

For an idea of how you might use the x and y accessors — you could set them to get the offsetLeft and offsetTop of DOM elements, so you can just pass an array of two DOM elements and generate an arrow between them:

```javascript
var swoopBetweenElements = swoopyArrow()
  .angle(Math.PI/4)
  .x(function(d) { return d.offsetLeft; })
  .y(function(d) { return d.offsetTop; });

svg.append("path.arrow-connector")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([document.querySelector('h1'), document.querySelector('h2')])
  .attr("d", swoopBetweenElements);
```

----

## To-do

- The idea is that you could pass an array of three points and it'd go through all three, but that's not yet reliably implemented here and you can imagine different ways of doing it; I'd just draw arrows between every consecutive pair, but you can also imagine, like, fitting the swoop through three points with non-constant curvature but no kinks, anyway.
- How to handle svg markers. should defs be done in js? should we bundle a bunch of Adobe Illustrator-style markers for convenience?
- Do we just want to pass in an array of points, or offer any convenience functions for handling connecting bounding boxes or converting between coordinate systems or whatever?
- Does passing in an array of two points make sense? i feel like it's simpler that way than having "from" and "to" accessors
- Should the whole thing actually just be a d3 curve factor that you pass to d3.line or w/e???
  - https://github.com/d3/d3-shape#curves
  - https://github.com/d3/d3-shape#custom-curves

> Swoopy arrows have been in use since Egyptian hieroglyphics. They belong to [no one](https://github.com/bizweekgraphics/swoopyarrows/blob/master/LICENSE) ↪↺↷⟲⤣⤥⤴⤵⤶⤷⤹⤳⤻⤿⤺  
— *[Jennifer Daniel](https://twitter.com/jenniferdaniel/status/464517373740204032), patron saint*

([see also](http://bwarchive.com/#/article/9360))
