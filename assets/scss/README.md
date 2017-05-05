# Style Guide Overview

## SASS Configurations and Setup

1. Start with `_settings.configs` to turn on/off bootstrap and possibly other configurations to overwrite BS as well.

2. `settings.variables` is basically a copy of Bootstrap's `_variables.scss`. We use that as a base for all projects to be consistent across.

### Files Structure Note

Files structure adapted from Harry Roberts. Mostly with BEM naming conventions and if you want to be sane, highly recommend naming your stuff the BEM way.

https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/

If you do use the following **suggested** files structure and BEM, I promise they will save you losing hair over specificity battles.

### Naming Conventions

BEM = Block__Element--Modifier

Example:
* `ul.menu`
* `li.menu__item` -> `.menu__item--green`