from django.conf import settings
from django.contrib.auth import views as auth_views
from django.urls import path, reverse_lazy

from user.views import web as views

app_name = 'user'
urlpatterns = [
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('login/', auth_views.LoginView.as_view(template_name='account/login.html'), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('password/', auth_views.PasswordChangeView.as_view(
        template_name='account/password_change.html',
    ), name='password_change'),
    path('password/reset/', auth_views.PasswordResetView.as_view(
        template_name='account/password_reset.html',
        success_url=reverse_lazy('account:password_reset_done'),
        email_template_name='account/email/password_reset.txt',
        subject_template_name='account/email/password_reset_subject.txt',
        extra_email_context={'APP_NAME': settings.APP_NAME_READABLE},
    ), name='reset_password'),
    path('password/reset/done/', auth_views.PasswordResetDoneView.as_view(
        template_name='account/password_reset_done.html',
    ), name='password_reset_done'),
    path('password/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name='account/password_reset_confirm.html',
        success_url=reverse_lazy('account:password_reset_complete'),
    ), name='password_reset_confirm'),
    path('password/reset/complete/', auth_views.PasswordResetCompleteView.as_view(
        template_name='account/password_reset_complete.html',
    ), name='password_reset_complete')
]
