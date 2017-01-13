from .base import *

import dj_database_url


INSTALLED_APPS = \
    ('django_gulp',) + \
    INSTALLED_APPS + \
    ('behave_django',)

COLLECTFAST_ENABLED = False
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

STATIC_URL = '/assets/'
MEDIA_URL = '/media/'

HOST = 'http://localhost:8000'

DATABASES = {}
config = dj_database_url.config()
if config:
    DATABASES['default'] = config
else:
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '<<PROJECT>>',
    }
