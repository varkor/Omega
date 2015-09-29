# Omega
A very lightweight DOM manipulation library

I often want to manipulate the DOM, but the existing solutions that I've come across are too heavy (though no doubt I would find one very similar to Omega.js if I looked hard enough). Besides, it was a little fun to write. I've got some plans for some nice features involving smart-form creation later.

## Use
```javascript
  "use strict";
  
  // Create a new <div> element
  let div = Ω(`div`);
  
  // Append a <span> with some text in the <div>
  let span = Ω(`span`).withText("A short introduction to Ω.js.").appendedTo(div);
  
  // Wrap an existing HTML element for ease-of-use
  let body = Ω(document.body);
  
  // And append our new <div> to the body
  body.append(div);
  
  // Create a table
  let table = Ω(`table`);
  
  // Let's add some interactivity
  let button = Ω(`button`).withText("Add a row").onClick(() => table.addRow(Ω(`span`).withText("Row")));
  
  body.append(button).append(table);
```
