# flake8: noqa

import os

import dj_database_url

from .production import *

INSTALLED_APPS = ('collectfast', ) + INSTALLED_APPS

###################
# MAIN AWS SETTINGS
###################

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')

####
# S3
####

AWS_S3_SECURE_URLS = os.environ.get('S3_SECURE_URLS', '1') == '1'
AWS_S3_USE_SSL = AWS_S3_SECURE_URLS
AWS_S3_URL_PROTOCOL = 'https:' if AWS_S3_SECURE_URLS else 'http:'

CACHES['collectfast'] = {
    'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    'LOCATION': 'collectfast',
}
COLLECTFAST_CACHE = 'collectfast'
COLLECTFAST_STRATEGY = 'collectfast.strategies.boto3.Boto3Strategy'

STATIC_URL = '/assets/'
MEDIA_URL = '/uploads/'

DEFAULT_FILE_STORAGE = 'core.storages.S3MediaStorage'
STATICFILES_STORAGE = 'core.storages.S3StaticStorage'

#####
# SES
#####

EMAIL_BACKEND = 'django_amazon_ses.EmailBackend'

#####
# RDS
#####

_database = dj_database_url.config()
if not _database:
    _database = {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('RDS_DB_NAME'),
        'USER': os.environ.get('RDS_USERNAME'),
        'PASSWORD': os.environ.get('RDS_PASSWORD'),
        'HOST': os.environ.get('RDS_HOSTNAME'),
        'PORT': os.environ.get('RDS_PORT'),
    }
DATABASES = {'default': _database}
