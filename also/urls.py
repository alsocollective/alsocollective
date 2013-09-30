from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'also.views.home', name='home'),
    url(r'^insta/','also.views.getNewInstaPost'),
    url(r'^data/','also.views.workData'),
    url(r'^adata/','also.views.aboutData'),
    url(r'^idata/','also.views.instaData'),

    url(r'^work/$','also.views.mWorkData',name="menu"),
    url(r'^work/(?P<project>.*)/$','also.views.mWorkData',name="projects"),
    url(r'^about/$','also.views.mAboutData'),
    url(r'^process/$','also.views.mInstaData'),
    url(r'^people/(?P<person>.*)/$','also.views.mPersons',name="persons"),
    #url(r'^basic/', 'also.views.pureData', name='home'),
    # url(r'^alsowD/', include('alsowD.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
