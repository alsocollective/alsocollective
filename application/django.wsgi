import os
import sys

sys.path.append('/srv/www/alsocollective.com/public_html/alsocollective')

os.environ['PYTHON_EGG_CACHE'] = '/srv/www/alsocollective.com/.python-egg'
os.environ['DJANGO_SETTINGS_MODULE'] = 'also.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
