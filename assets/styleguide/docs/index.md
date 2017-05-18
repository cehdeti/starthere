---
layout: docs
title: What is this?
description: Hey! You should read me first!
group: overview
---

This Style Guide is based off Bootstrap 4.0 Alpha as of (5/2017). The concept is that we will reuse the `_variables` from Bootstrap as a _base_ for all variables to keep things consistent.

The idea is that if you changed your `_theme.scss` in your `static/scss` folder, this should inherit the themes from it so you can visually see all of the changes.

## Turning on/off Bootstrap

The goal is to not only able to use BS, but also other frameworks. So setting `$use-bootstrap` to `false` inside `app.scss`. By setting it to `false` you're basically no longer using their grids and mixins, but obviously you want to remove/replace the `bootstrap` node module or other means on your own. Just the variables will be the stay as our defaults.

## Custom Variables or Components

Well, the idea that you would add your custom components as you go into this styleguide as documentation. We don't want every little thing to be documented, but something weird and complex that you probably want to add such as maybe a custom Modal box or grid.