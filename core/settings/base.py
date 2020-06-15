import os
from django.core import exceptions
from django.utils.translation import gettext_lazy as _

from core.utils import is_testing


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

APP_NAME = '<<PROJECT>>'
APP_NAME_READABLE = _('<<PROJECT>>')


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', '1') == '1'

# SECURITY WARNING: keep the secret key used in production secret!
if 'SECRET_KEY' in os.environ:
    SECRET_KEY = os.environ['SECRET_KEY']
elif DEBUG:
    SECRET_KEY = 'not_secret'
else:
    raise exceptions.ImproperlyConfigured('You must set a `SECRET_KEY` env var when `DEBUG` is not enabled')

# Are we running the test suite?
TESTING = is_testing()

ALLOWED_HOSTS = ['*']
INTERNAL_IPS = ['127.0.0.1']

SITE_ID = 1

INSTALLED_APPS = (
    'collectfast',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',

    'storages',
    'bootstrap4',
    'corsheaders',

    'user',
    'web',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'rollbar.contrib.django.middleware.RollbarNotifierMiddleware',
)

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.media',
                'django.template.context_processors.request',
                'django.template.context_processors.static',

                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

                'core.context_processors.misc',
            ],
        },
    },
]

AUTH_USER_MODEL = 'user.Account'

CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOW_METHODS = ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS')

WSGI_APPLICATION = 'core.wsgi.application'


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'America/Chicago'
USE_I18N = True
USE_L10N = True
USE_TZ = True


MEDIA_ROOT = '%s/media/' % BASE_DIR


CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    },
    'collectfast': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'collectfast',
    }
}

COLLECTFAST_CACHE = 'collectfast'


STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, '.assets'),
)


ROLLBAR = {
    'enabled': False,
}
