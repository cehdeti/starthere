import os
from .base import *


###################
# MAIN AWS SETTINGS
###################

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')

AWS_PRELOAD_METADATA = True

####
# S3
####

AWS_S3_SECURE_URLS = os.environ.get('S3_SECURE_URLS', '1') == '1'
AWS_S3_USE_SSL = AWS_S3_SECURE_URLS
AWS_S3_URL_PROTOCOL = 'https:' if AWS_S3_SECURE_URLS else 'http:'
AWS_STORAGE_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME

# The subdirectory within the S3 bucket for storing static files (compiled
# assets, templates, etc).
STATIC_DIR = 'assets'

# The subdirectory with the S3 bucket for storing all other media, including
# user-uploaded files, etc.
MEDIA_DIR = 'uploads'

STATIC_URL = '%s//%s/%s/' % (AWS_S3_URL_PROTOCOL, AWS_S3_CUSTOM_DOMAIN, STATIC_DIR)
STATIC_ROOT = '/%s/' % STATIC_DIR
MEDIA_URL = '%s//%s/%s/' % (AWS_S3_URL_PROTOCOL, AWS_S3_CUSTOM_DOMAIN, MEDIA_DIR)

DEFAULT_FILE_STORAGE = 'core.s3_storages.MediaStorage'
STATICFILES_STORAGE = 'core.s3_storages.StaticStorage'

#####
# RDS
#####

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('RDS_DB_NAME'),
        'USER': os.environ.get('RDS_USERNAME'),
        'PASSWORD': os.environ.get('RDS_PASSWORD'),
        'HOST': os.environ.get('RDS_HOSTNAME'),
        'PORT': os.environ.get('RDS_PORT'),
    }
}

HOST = 'http://<<PROJECT>>.elasticbeanstalk.com'
