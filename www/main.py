'''
Created on Nov 25, 2013

@author: vbrown
'''

import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
import logging

class ProjectPage(webapp.RequestHandler):
    """Render the main landing page where users can view instructions and create a new one."""
    def get(self):
        path = self.request.path
        temp = os.path.join(
            os.path.dirname(__file__),
            'templates/' + path + '.html')

        if not os.path.isfile(temp):
            temp = os.path.join(
                os.path.dirname(__file__),
                'templates/index.html')

        outstr = template.render(temp, { })
        self.response.out.write(outstr)


application = webapp.WSGIApplication([
    ('/.*', ProjectPage),
    ], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
