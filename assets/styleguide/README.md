# Style Guide Overview

## Setup

1. Make sure you're inside the `styleguide` folder 
2. `bundle install`
3. Start up and do a jekyll build: `jekyll serve --watch` on `styleguide` root
4. `cd docs/assets/` then `sass --watch scss/docs.scss:css/docs.min.css -t compressed`

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
