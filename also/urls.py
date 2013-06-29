from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'ALSO.views.home', name='home'),
    url(r'^insta/','ALSO.views.getNewInstaPost'),
    url(r'^data/','ALSO.views.workData'),
    url(r'^adata/','ALSO.views.aboutData'),
    url(r'^idata/','ALSO.views.instaData'),


    #url(r'^basic/', 'ALSO.views.pureData', name='home'),
    # url(r'^ALSOwD/', include('ALSOwD.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
