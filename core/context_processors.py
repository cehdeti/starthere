from django.conf import settings


def misc(request):
    return {
        'APP_NAME': settings.APP_NAME_READABLE
    }
