swoopyarrows.js
===============

> Out of the crooked timber of JavaScript, no straight arrow was ever made.  
*— Immanuel Kant*

Finally an open source project to match the scope of our ambition! A family of three path generators for making nice fun arrows. Each has x and y accessors and a couple other options. 

**TODO: The idea is that you could pass an array of three points and it'd go through all three, but that's not yet reliably implemented here and you can imagine different ways of doing it; I'd just draw arrows between every consecutive pair, but you can also imagine, like, fitting the swoop through three points with non-constant curvature but no kinks, anyway.**

## swoopyArrow

```javascript
var swoopy = d3.svg.swoopy()
  .angle(Math.PI/4)
  .x(ƒ(0))
  .y(ƒ(1));

svg.append("path.arrow-connector")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([[100,200],[300,400]])
  .attr("d", swoopy);
```

## loopyArrow

```javascript
var loopy = d3.svg.loopy()
  .steps(30)
  .radius(20)
  .x(ƒ(0))
  .y(ƒ(1));

svg.append("path.arrow-connector")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([[400,600],[800,100]])
  .attr("d", loopy);
```

## kookyArrow

```javascript
var kooky = d3.svg.kooky()
  .steps(5)
  .deviation(100)
  .x(ƒ(0))
  .y(ƒ(1));

svg.append("path.arrow-connector")
  .attr('marker-end', 'url(#arrowhead)')
  .datum([[1000,200],[700,600]])
  .attr("d", kooky);
```

----

> Swoopy arrows have been in use since Egyptian hieroglyphics. They belong to [no one](https://github.com/bizweekgraphics/swoopyarrows/blob/master/LICENSE) ↪↺↷⟲⤣⤥⤴⤵⤶⤷⤹⤳⤻⤿⤺  
— *[Jennifer Daniel](https://twitter.com/jenniferdaniel/status/464517373740204032), patron saint*

([see also](http://bwarchive.com/#/article/9360))
