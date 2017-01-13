from .base import *


INSTALLED_APPS += ('behave_django',)
TEST_RUNNER = 'rainbowtests.test.runner.RainbowDiscoverRunner'
