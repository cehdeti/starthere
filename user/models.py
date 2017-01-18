from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.six import python_2_unicode_compatible
from django.utils.translation import ugettext as _


@python_2_unicode_compatible
class Account(AbstractBaseUser):

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True, verbose_name=_('Active'))
    is_admin = models.BooleanField(default=False, verbose_name=_('Superadmin'))
    date_joined = models.DateTimeField(auto_now_add=True)

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        "Returns the short name for the user."
        return self.first_name

    def clean(self):
        super(self.__class__, self).clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def __str__(self):
        full_name = self.get_full_name()
        return full_name if full_name else self.email
