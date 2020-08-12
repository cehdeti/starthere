from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.sitemaps.views import sitemap


from web import views
from web.sitemap import DEFAULT_SITEMAPS


urlpatterns = [
    path('', views.home, name='home'),
    path('accounts/', include('user.urls.web.account')),
    path('sitemap.xml', sitemap, {'sitemaps': DEFAULT_SITEMAPS}),
]


urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = views.do404
handler500 = views.do500