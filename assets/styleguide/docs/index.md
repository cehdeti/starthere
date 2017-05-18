---
layout: docs
title: What is this?
description: Hey! You should read me first!
group: overview
---

This Style Guide is based off Bootstrap 4.0 Alpha as of (5/2017). The concept is that we will adapt the `_variables` from Bootstrap as a _base_ for all variables to keep things consistent. The idea is that if you changed your `_theme.scss` in your `static/scss` folder, this should inherit the theme settings so you can visually see all of the changes.

## Turning on/off Bootstrap

The goal is to not only able to use BS, but also other frameworks. So by setting it to `false` you're basically no longer using their grids and mixins, but obviously you want to remove/replace the `bootstrap` node module or other means on your own. Just the variables will be the stay as our defaults.

## Custom Variables or Components

Well, the idea that you would add your custom components as you go into this styleguide as documentation. We don't want every little thing to be documented, but something weird and complex that you probably want to add such as maybe a custom Modal box or grid.

### Files Structure Note

* `app.scss` is obviously enough that it should contains everything that styles the app itself. It is basically a big old specificities triangle. ETI edition :)
* `theme.scss` is the basic theming, including overriding Bootstrap or other framework's variables if using it.

### Three Classes are too much and extending is even better

Whether you decide to use Bootstrap or other frameworks or not. Extending is better than adding inline classes. For example:

```
<div class="row">
    <div class="col-xs-12 col-md-6">...</div>
    <div class="col-xs-12 col-md-6">...</div>
</div>
```

Try this instead:

```
<div class="sementic__class-name">
    <div class="semantic__column-name">...</div>
    <div class="semantic__column-name">...</div>
</div>

.semantic {
    &__class-name {
        @extend .row; //or @include make-row()
    }

    &__column-name {
        @extend .col-xs-12, .col-md-6; //or use @include make-column()
    }
}
```

Why? Because in the future if you decided to upgrade or change to a completely different framework, you don't have to hunt down _every single one_ of those `.col-xs-*`, you just have to change them inside your SCSS. Not to mention you have more meaningful class names. BOOM!

### Naming Conventions

BEM = Block__Element--Modifier

Example:
* `ul.menu`
* `li.menu__item` -> `.menu__item--green`

Why add a class on everything? I'll let [this guy](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) does the talking.


