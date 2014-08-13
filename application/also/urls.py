from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'also.views.newHome', name='home'),
    url(r'ajax/work/', 'also.views.newWork', name='work'),
    url(r'ajax/about/', 'also.views.newAbout', name='work'),
    url(r'ajax/process/', 'also.views.newProcess', name='process'),



    url(r'^insta/','also.views.getNewInstaPost'),
    url(r'^data/','also.views.workData'),
    url(r'^adata/','also.views.aboutData'),
    url(r'^idata/','also.views.instaData'),

    url(r'^work/$','also.views.mWorkData',name="menu"),
    url(r'^work/(?P<project>.*)/$','also.views.mWorkData',name="projects"),
    url(r'^about/$','also.views.mAboutData'),
    url(r'^process/$','also.views.mInstaData'),
    url(r'^people/(?P<person>.*)/$','also.views.mPersons',name="persons"),

    url(r'^other/','also.views.allData'),
    url(r'^simple/work/(?P<project>.*)/$','also.views.simplework',name="projects"),
    url(r'^archive/$','also.views.simpleworklist',name="archivelist"),
    url(r'^archive/(?P<project>.*)/$','also.views.simplework',name="archive"),

    #url(r'^basic/', 'also.views.pureData', name='home'),
    # url(r'^alsowD/', include('alsowD.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'seo/sitemap\.xml', 'also.views.sitemap', name="sitemap"),
)

from django.conf import settings

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
   )