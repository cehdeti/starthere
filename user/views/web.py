from django.contrib import messages
from django.shortcuts import redirect
from django.utils.translation import gettext as _
from django.views.generic import TemplateView

try:
    from loginas.utils import restore_original_login as logout
except ImportError:
    from django.contrib.auth import logout


class LogoutView(TemplateView):
    template_name = 'account/logout.html'

    def post(self, request, *args, **kargs):
        logout(request)
        messages.success(request, _('You have been logged out. See you next time.'))
        return redirect('home')
