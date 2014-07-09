swoopyarrows.js
===============

Finally an open source project to match the scope of our ambition! **swoopyarrows.js** makes swoopy arrows between things. It currently depends on D3 and returns a closure vaguely akin to the [d3.svg.axis()](https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-axis) object, except sloppier and more confused. Example:
```javascript
// set up new arrow
swoop = swoopyArrow()
  .from(d3.select("rect"))
  .to([300,400])
  .degrees(90)
  .clockwise(true);

// draw sample arrow
var svg = d3.select("svg").call(swoop);
```
---
<a href="#swoopyArrow" name="swoopyArrow">#</a> **swoopyArrow**()

Create a new default swoopy arrow object.

<a href="#swoopyArrow" name="swoopyArrow">#</a> **arrow**(*selection*)

Apply the arrow to a selection, aka append it. Selection must be an SVG or G element.

<a href="#from" name="from">#</a> arrow.**from**([*element*])  
<a href="#to" name="to">#</a> arrow.**to**([*element*])

Get or set where to draw the arrow from and to, in any of four forms (in any mix):
  - a DOM element:            `document.getElementById("hed")`
  - a jQuery element:         `$("#hed")`
  - a D3 element:             `d3.select("#hed")`
  - a coordinate array [x,y]: `[100,200]`

<a href="#degrees" name="degrees">#</a> arrow.**degrees**([*degrees*])

Get or set the angle which the arc of the arrow will subtend.
  - 90 for a gentle arc, 180 for a bigger swoop.
  - Beyond 180, it gets gentler again, because of the way SVG computes arc.
  - Pass 0 or 360 for a straight arrow.

<a href="#clockwise" name="clockwise">#</a> arrow.**clockwise**([*boolean*]) 

Get or set boolean determining whether arrow will swoop clockwise (true) or counterclockwise (false).

---

Welp, that's it for now! Feel free to check out our many [issues](https://github.com/bizweekgraphics/swoopyarrows/issues) and [laugh in my face](https://twitter.com/tophtucker).

> Swoopy arrows have been in use since Egyptian hieroglyphics. They belong to [no one](https://github.com/bizweekgraphics/swoopyarrows/blob/master/LICENSE) ↪↺↷⟲⤣⤥⤴⤵⤶⤷⤹⤳⤻⤿⤺

— [Jennifer Daniel](https://twitter.com/jenniferdaniel/status/464517373740204032), patron saint
