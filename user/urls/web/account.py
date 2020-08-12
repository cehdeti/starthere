from django.contrib.auth import views as auth_views
from django.urls import path, re_path, reverse_lazy

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='account/login.html'), name='account_login'),
    path('logout/', auth_views.LogoutView.as_view(), name='account_logout'),
    path('password/', auth_views.PasswordChangeView.as_view(
        template_name='account/password_change.html',
    ), name='password_change'),
    path('password/reset/', auth_views.PasswordResetView.as_view(
        template_name='account/password_reset.html',
        success_url=reverse_lazy('account_password_reset_done'),
        email_template_name='account/email/password_reset.txt',
        subject_template_name='account/email/password_reset_subject.txt',
    ), name='account_reset_password'),
    path('password/reset/done/', auth_views.PasswordResetDoneView.as_view(
        template_name='account/password_reset_done.html',
    ), name='account_password_reset_done'),
    re_path(r'^password/reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', auth_views.PasswordResetConfirmView.as_view(
        template_name='account/password_reset_confirm.html',
        success_url=reverse_lazy('account_password_reset_complete'),
    ), name='account_password_reset_confirm'),
    path('password/reset/complete/', auth_views.PasswordResetCompleteView.as_view(
        template_name='account/password_reset_complete.html',
    ), name='account_password_reset_complete')
]
