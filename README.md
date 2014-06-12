swoopyarrows.js
===============

Finally an open source project to match the scope of our ambition! **swoopyarrows.js** makes swoopy arrows between things.

It is a very simple function, not a closure or whatever. It currently depends on jQuery *and* D3 and returns a D3 reference. Obviously all that sucks so maybe I'll spruce it up a little before ~~dumping~~ publicizing.

### `drawArrow(parent, from, to, degrees, clockwise)`
  
**parent** — the svg container or element to which to append the arrow
**from, to** — where to draw the arrow from and to, in any of four forms (in any mix):
  - a DOM element:            `document.getElementById("hed")`
  - a jQuery element:         `$("#hed")`
  - a D3 element:             `d3.select("#hed")`
  - a coordinate array [x,y]: `[100,200]`

**degrees** — the angle which the arc of the arrow will subtend.
  - 90 for a gentle arc, 180 for a bigger swoop.
  - beyond 180, it gets gentler again, because of the way SVG computes arc.
  - pass 0 or 360 for a straight arrow.

**clockwise** — boolean determining whether arrow will swoop clockwise (true) or counterclockwise (false).

---

> ### Swoopy arrows have been in use since Egyptian hieroglyphics. They belong to no one ↪↺↷⟲⤣⤥⤴⤵⤶⤷⤹⤳⤻⤿⤺

### — [Jennifer Daniel](https://twitter.com/jenniferdaniel/status/464517373740204032), patron saint
([see also](https://github.com/bizweekgraphics/swoopyarrows/blob/master/LICENSE))
