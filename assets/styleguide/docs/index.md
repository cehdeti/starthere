---
layout: docs
title: What is this? 
description: Hey! You should read me first!
group: overview
redirect_from: "/overview/"
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
    <div class="col-12 col-md-6">...</div>
    <div class="col-12 col-md-6">...</div>
</div>
```

#### Recommendation / Suggestion ####

When you find yourself adding 3+ classes to one element, ask yourself if you are going to reuse this elsewhere? If you do, it might makes sense to extend them into one single semantic class. The following might be harder to debug due to multiple extensions even with sourceMaps, but it is obviously more semantic. You can easily look up the file name a lot faster and if you use the same classes across, you can change it one place instead of going back to the HTML's to remove the classes that you don't need. It is up to you to decide since everyone's coding styles is different. Another pro for this is if the team decides to switch to a different framework or whatever, you don't have to go through the HTML's again.

```
<div class="semantic__class-name">
    <div class="semantic__column-name">...</div>
    <div class="semantic__column-name">...</div>
</div>

.semantic {
    &__class-name {
        @extend .row; //or @include make-row()
    }

    &__column-name {
        @extend .col-12, .col-md-6, .col-lg-8;
    }
}
```

### Naming Conventions

BEM = Block__Element--Modifier

Example:
* `ul.menu`
* `li.menu__item` -> `.menu__item--green`

Why add a class on everything? I'll let [this guy](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) does the talking.

**Note** Just like extending everything into one semantic class name makes sense, but it also just as bad to have something like: `.element__parent-child--stuff`, if you have to add more modifiers... you see where it's going right? Rule of thumb, if it's more than 3 elements + 1 modifier looks ugly, it's probably is. That's why I support the use of the "dot" and still have meaningful context:

```
<li class="menu__item green super-big">

li.menu__item {
    &.green {}
    &.blue {}
    &.super-big {}
}
```

Sure, it's almost _too_ general and seriously if you have to overwrite the specificity again, it's probably you're doing something _really_ weird. Besides, it's better than (back to square one on reducing classes):

```
<li class="menu__item menu__item--green menu__item--super-big">

li.menu__item {
    &--green {}
    &--super-big
}
```

### Quick notes on styleguide maintenance

Just a reminder if you're adding new pages to this styleguide, here's quick tour:

* Only files inside `docs` will be build out to the `_gh_pages`
* Adding new subpage: 
    * In the category/folder (Ex: `content`) you want, just copy one of the `.md` file as from `content` or `components` as a base
    * Open up `/docs/_data/nav.yml` and add your new page in.
* How the side menu and categories work:
    * To add a new category, create a new folder then
    * `/docs/_data/nav.yml` - Add your new category etc...
    * Add them into the side menu: `/docs/_includes/nav-docs.html`
    * Lastly, if you want a fancy page title heading. Add the grouping in `/docs/_includes/page-headers.html`