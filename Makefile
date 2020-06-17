.DEFAULT: all

all: test lint deps/security
.PHONY: all

#####################
# Database operations
#####################

db: db/migrate db/fixtures
.PHONY: db

db/fixtures:
	pipenv run python manage.py loaddata initial
.PHONY: db/fixtures

db/migrate:
	pipenv run python manage.py migrate
.PHONY: db/migrate

############
# Deployment
############

ebenv = $(shell echo "$(1)" | grep -Eo "$(2)=([^ ]+)" | sed 's/^.*=//')

deploy: deploy/assets/build deploy/deps/lock deploy/envs deploy/clean
.PHONY: deploy

deploy/assets: deploy/assets/build deploy/assets/upload
.PHONY: deploy/assets

deploy/assets/build: deps/frontend
	gulp clean && gulp build --production
.PHONY: deploy/assets/build

deploy/assets/upload: S3_BUCKET_NAME=$(call ebenv, "$(_EB_ENV)", S3_BUCKET_NAME)
deploy/assets/upload: DJANGO_SETTINGS_MODULE=$(call ebenv, "$(_EB_ENV)", DJANGO_SETTINGS_MODULE)
deploy/assets/upload:
	DJANGO_SETTINGS_MODULE="$(DJANGO_SETTINGS_MODULE)" S3_BUCKET_NAME="$(S3_BUCKET_NAME)" pipenv run python manage.py collectstatic --no-input
.PHONY: deploy/assets/upload

deploy/clean:
	-rm -rf requirements.txt
.PHONY: deploy/clean

deploy/deps/lock:
	pipenv lock --requirements > requirements.txt
.PHONY: deploy/deps/lock

deploy/eb:
	pipenv run eb deploy "${DEPLOY_ENV}"
	pipenv run eb labs cleanup-versions "${DEPLOY_ENV}" --num-to-leave=5 --force
.PHONY: deploy/eb

deploy/env: _EB_ENV="$(shell pipenv run eb printenv "${DEPLOY_ENV}" | tail -n +2 | sed -e 's/^[ \t]*//' | sed -e 's/ = /=/')"
deploy/env: deploy/eb deploy/assets/upload deploy/notify
.PHONY: deploy/env

deploy/envs: DEPLOY_ENVS=$(or ${DEPLOY_TO},$(shell pipenv run eb list | grep "\* " | sed -e 's/\* //'))
deploy/envs:
	@for environment in $(DEPLOY_ENVS); do \
		$(MAKE) DEPLOY_ENV=$$environment deploy/env; \
	done
.PHONY: deploy/env

deploy/notify: ROLLBAR_ENV=$(call ebenv, "$(_EB_ENV)", ROLLBAR_ENV)
deploy/notify: ROLLBAR_ACCESS_TOKEN=$(call ebenv, "$(_EB_ENV)", ROLLBAR_ACCESS_TOKEN)
deploy/notify:
	@if [ -n "$(ROLLBAR_ENV)" ]; then \
		curl https://api.rollbar.com/api/1/deploy/ \
			--silent \
			-F access_token="$(ROLLBAR_ACCESS_TOKEN)" \
			-F environment="$(ROLLBAR_ENV)" \
			-F revision="$(shell git log -n 1 --pretty=format:%H)" \
			-F local_username="$(shell git config --get github.user)" \
			> /dev/null; \
	else \
		echo "Could not determine rollbar environment"; \
	fi
.PHONY: deploy/notify

##############
# Dependencies
##############

deps: deps/backend deps/frontend
.PHONY: deps
deps/outdated: deps/backend/outdated deps/frontend/outdated
.PHONY: deps/outdated
deps/security: deps/backend/security deps/frontend/security
.PHONY: deps/security
deps/update: deps/backend/update deps/frontend/update
.PHONY: deps/update

deps/backend:
	pipenv install --dev --ignore-pipfile
.PHONY: deps/backend

deps/backend/outdated:
	-pipenv update --dev --dry-run
.PHONY: deps/backend/outdated

deps/backend/security:
	-pipenv check
.PHONY: deps/backend/security

deps/backend/update:
	pipenv update --dev
.PHONY: deps/backend/update

deps/frontend:
	npm install --from-lock-file
.PHONY: deps/frontend

deps/frontend/outdated:
	-npm outdated
.PHONY: deps/frontend/outdated

deps/frontend/security:
	-npm audit
.PHONY: deps/frontend/security

deps/frontend/update:
	npm update
.PHONY: deps/frontend/update

#########
# Linting
#########

lint: lint/backend lint/frontend
.PHONY: lint

lint/backend:
	pipenv run flake8 .
.PHONY: lint/backend

lint/frontend:
	./node_modules/gulp/bin/gulp.js lint
.PHONY: lint/frontend

#########
# Testing
#########

test: test/functional test/unit
.PHONY: test

test_functional = manage.py behave --keepdb --format progress
test/functional:
	pipenv run python $(test_functional)
.PHONY: test/functional

test_unit = manage.py test --keepdb --reverse
test/unit:
	pipenv run python $(test_unit)
.PHONY: test/unit

test/coverage:
	rm -rf .coverage
	coverage run -a $(test_functional) && coverage run -a $(test_unit)
.PHONY: test/coverage

test/coverage/html: test/coverage
	rm -rf htmlcov
	coverage html
.PHONY: test/coverage/html

##########
# Workflow
##########

update: deps db
.PHONY: update

setup: update
	# <<REMOVE_BEGIN>>
	$(MAKE) setup/git_reinit
	$(MAKE) setup/replace_project_meta
	# <<REMOVE_END>>
	pipenv run python manage.py createsuperuser
.PHONY: setup
# <<REMOVE_BEGIN>>

setup/replace_project_meta: APP_SLUG ?= $(shell read -p "App Slug: " app_name; echo $$app_name)
setup/replace_project_meta: APP_NAME ?= $(shell read -p "App Name (Human-Readable): " app_name_readable; echo $$app_name_readable)
setup/replace_project_meta:
	find . -type f ! -path './.git/*' ! -name 'Makefile' ! -path './node_modules/*' ! -path './.venv/' -print0 | xargs -0 env LC_CTYPE=C LANG=C sed -i '' "s/<<APP_SLUG>>/$(APP_SLUG)/g"
	find . -type f ! -path './.git/*' ! -name 'Makefile' ! -path './node_modules/*' ! -path './.venv/' -print0 | xargs -0 env LC_CTYPE=C LANG=C sed -i '' "s/<<APP_NAME>>/$(APP_NAME)/g"
	find . -type f ! -path './.git/*' ! -path './node_modules/*' ! -path './.venv' -print0 | xargs -0 env LC_CTYPE=C LANG=C sed -i '' '/^[[:space:]]*# <<REMOVE_BEGIN>>$$/,/^[[:space:]]*# <<REMOVE_END>>$$/d'
.PHONY: setup/replace_project_meta

setup/git_reinit:
	rm -rf .git
	git init
.PHONY: setup/git_reinit
# <<REMOVE_END>>
