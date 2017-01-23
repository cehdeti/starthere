# <<REMOVE_BEGIN>>
# Start Here

A starter repo for ETI projects. Uses Django, gulp, sass, and all the good stuff.

Copy the contents of this repo (including this README) to your new project's
repo, then follow the instructions below. The `bin/setup` script will detect
that you are starting a new project from the `starthere` app and replace some
strings, do additional setup, etc.
# <<REMOVE_END>>
# <<PROJECT>>

## Requirements/Versions

* Python 3.5.x
* PostgreSQL 9.4.x

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
5. If your system python isnt python 3 and you'd like to use python 3, create your virtual environment and activate it
```
      python3 -m venv venv
      source venv/bin/activate
```
6. Run the setup script to initialize the app: `./bin/setup`
7. You should be OK to go. Now you only have to start the server: `python manage.py runserver`

Now you can view the site in your browser at http://127.0.0.1:8000.

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

* Running the tests + pep8 style checks: `./bin/test`
* Running the functional tests only: `python manage.py behave --keepdb`
* Running the unit tests only: `python manage.py test --keepdb`
* Generate coverage reports: `coverage run manage.py test --keepdb && coverage html`.
  Now you should have a `htmlcov/index.html` file that you can view in
  a browser.

Front-end unit tests can be run with `gulp test:js` and they will run according to the
karma.js config.

## Deployment

Currently, the application is deployed to Amazon AWS. To deploy, just run the
`./bin/deploy` script. This will compile the frontend assets, upload them to
S3, then deploy the backend application with Elastic Beanstalk.
