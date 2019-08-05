# <<REMOVE_BEGIN>>
# Start Here

A starter repo for ETI projects. Uses Django, gulp, sass, and all the good stuff.

Copy the contents of this repo (including this README) to your new project's
repo, then follow the instructions below. The `make setup` script will detect
that you are starting a new project from the `starthere` app and replace some
strings, do additional setup, etc.

## IMPORTANT

**DO NOT** run `make setup` in the `starthere` project. Lots of mess to clean up if you do that. Clone then run it in a different project folder.

# <<REMOVE_END>>
# <<PROJECT>>


## Requirements/Versions

* Python 3.5.x
* PostgreSQL 9.4.x
* NPM 10.6.0+ (or use [nvm](https://github.com/nvm-sh/nvm) to manage versions)

## Installation

1. Check out the project. Make sure to switch to the `development` branch after cloning the repo.
2. If you don't have `postgresql` running on your machine, install it. You can homebrew it (`brew install postgresql94`) or [Postgres.app](http://postgresapp.com/) makes it pretty easy.
3. Make sure you have the OSX command line developer tools installed. If you
   don't have them, you can install XCode from self service and they will be
   installed alongside Xcode: `sudo xcode-select --install`
4. Create a database for the project:
        createdb "$(basename "$(pwd)")"
        # or if you're using Postgres.app:
        /Applications/Postgres.app/Contents/Versions/latest/bin/createdb "$(basename "$(pwd)")"
5. Run the setup script to initialize the app: `make setup`
6. `pipenv` should be installed during the setup script. Then: 
```
      //You wil have to type `pipenv run` every time
      pipenv run ./manage.py [commands]

      //OR activate the environment then you can just type `./manage.py [commands]`:
      pipenv shell
```
7. You should be OK to go. Now you only have to start the server: `pipenv run ./manage.py runserver`. This command will also invokes the `gulp` command as well so once it's finished compiling, you can see your site on either: `localhost:8000` or `localhost:3000` (with BrowserSync)

## Front-end

All frontend assets should reside in `./assets/`, the outputs for the assets will be in the `./static`.

### Dependencies

* [Bootstrap 4 Beta](https://getbootstrap.com/docs/4.0)
* [FontAwesome 5](https://fontawesome.com/) - The included package is the FREE version. But we do have a Pro license if you want to use it. You will need to add your project's domain to FontAwesome (ask John or Mon for login).
  * [Go here](https://fontawesome.com/how-to-use/js-component-packages) to set your npm config
  * How to use and troubleshooting: [See docs](https://fontawesome.com/how-to-use/web-fonts-with-css)

### Running Gulp Task

If you ran `make setup`, npm dependencies should be installed. The default `gulp` task is the `watch` task that launches alongside with `./manage.py runserver`, so you shouldn't have to run it individually.

### Gulp Configs

All of the `gulp` configurations live in the file `gulp.configs.js`.


## Testing

You'll find unit tests inside the `tests` directory of each app in the root
directory and functional tests in the `features` directory. They are written with the following toolset:

* `behave` for functional tests
* `splinter` for browser simulation
* Python's built-in `unittest` module and its built in `unittest.mock` module
  for mocking
* [`factory-boy`](https://factoryboy.readthedocs.io) for generating data
* `coverage.py` for code coverage

Some helpful commands:

* Running the tests + pep8 style checks: `make test`
* Running the functional tests only: `python manage.py behave --keepdb`
* Running the unit tests only: `python manage.py test --keepdb`
* Generate coverage reports: `coverage run manage.py test --keepdb && coverage html`.
  Now you should have a `htmlcov/index.html` file that you can view in
  a browser.

Front-end unit tests can be run with `gulp test:js` and they will run according to the
karma.js config.

## Deployment

You will need `awscli` in order to deploy. If you don't have `awscli` installed, run `brew install awscli` and `brew install aws-elasticbeanstalk`

Currently, the application is deployed to Amazon AWS. To deploy, just run the
`make deploy` script. This will compile the frontend assets, upload them to
S3, then deploy the backend application with Elastic Beanstalk.

Refer to the [ETI Dev Wiki](https://github.com/cehdeti/etidev/wiki/Setting-Up-New-AWS-Instance) on setting up instances.


