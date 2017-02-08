tl;dr - A Living Style guide
============================

What the heck is this?

* This style guide uses [Atomic Design Principles](http://bradfrost.com/blog/post/atomic-web-design/) to help drive project conventions in a scalable, maintainable direction.
* Developers contribute to the style guide via annotations in their code. You can learn more [here](#tutorial).

Tutorial
--------

If you look at `_atoms.buttons.scss`, you'll notice the annotations at the bottom begin with:

```
// Atoms
//
// Index of existing "Atom" patterns.
//
// Styleguide 3.0
```
The first row indicates the name of the category. It's then separated by an empty comment, and then a description as added. In this convention, titles, descriptions, markup, modifier classes, etc, are separated by an empty comment line.

At the very end of a block, `Styleguide` and the figure number is added -- `3.0`. Each new category must be `*.0`. Each section nested within that category must contain a floating number for the figure, like `3.1`. You can also go deeper with something like `3.1.1`. This determines how sections are nested visually within the generated document.

Let's take a look at a section that contains actual markup:
```
// Button Color Variations
//
// markup:
// <button class="ui-btn {$modifiers}">Button</button>
//
// .ui-btn--outline - Creates a button with a transparent background.
// .ui-btn--primary - Colors a button with the primary brand color.
// .ui-btn--secondary - Colors a button with the secondary brand color.
// .ui-btn--tertiary - Colors a button with the tertiary brand color.
//
// Styleguide 3.1.1
```
From top to bottom, we have the following:
* Title
* Markup
* Modifier classes
* Figure number

Markup must begin with `markup:`. After that, you can add code. Notice that in the example above, a binding -- `{$modifiers}` -- is contained in the class attribute. Adding this binding allows SC5 to loop through the modifier classes that are defined below the markup, rendering actual elements in the documentation that contain each modifier class.

Modifier classes are added below markup, and must contain a description that's separated by a hyphen (`-`).

If you want `variables` related to a specific element to appear, you can add them to the beginning of a particular section. In this example, I added them to the parent of each nested section, fashioned in the same way as modifier classes.

```
// Buttons
//
// A button has several available modifiers influencing color, border, inner contents, and size.
//
// $btn-vertical-padding - The vertical padding of a button.
// $btn-horizontal-padding - The horizontal padding of a button.
// $btn-border-radius - A buttons border radius.
//
// markup: <button style="padding:{$modifiers}">Modifiers</button>
//
// Styleguide 3.1
```
