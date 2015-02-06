'''
Created on Nov 25, 2013

@author: vbrown
'''

import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class MainPage(webapp.RequestHandler):
    """Render the main landing page where users can view instructions and create a new one."""
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__) + '/templates/', 'index.html')
        self.response.out.write(template.render(path, template_values))

class MetaTicTacToePage(webapp.RequestHandler):
    """Render the main landing page where users can view instructions and create a new one."""
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__) + '/templates/', 'metatictactoe.html')
        self.response.out.write(template.render(path, template_values))

class BioacousticsPage(webapp.RequestHandler):
    """Render the main landing page where users can view instructions and create a new one."""
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__) + '/templates/', 'bioacoustics.html')
        self.response.out.write(template.render(path, template_values))

class MtPage(webapp.RequestHandler):
    """Render the main landing page where users can view instructions and create a new one."""
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__) + '/templates/', 'mt.html')
        self.response.out.write(template.render(path, template_values))

class FunnyWordsPage(webapp.RequestHandler):
    """Render the main landing page where users can view instructions and create a new one."""
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__) + '/templates/', 'funnywords.html')
        self.response.out.write(template.render(path, template_values))

class OpenDisclosurePage(webapp.RequestHandler):
    """Render the main landing page where users can view instructions and create a new one."""
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__) + '/templates/', 'opendisclosure.html')
        self.response.out.write(template.render(path, template_values))

class WritingPage(webapp.RequestHandler):
    """Render the main landing page where users can view instructions and create a new one."""
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__) + '/templates/', 'writing.html')
        self.response.out.write(template.render(path, template_values))

class ProjectsPage(webapp.RequestHandler):
    """Render the main landing page where users can view instructions and create a new one."""
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__) + '/templates/', 'projects.html')
        self.response.out.write(template.render(path, template_values))


application = webapp.WSGIApplication([
    ('/', MainPage),
    ('/opendisclosure', OpenDisclosurePage),
    ('/metatictactoe', MetaTicTacToePage),
    ('/bioacoustics', BioacousticsPage),
    ('/mt', MtPage),
    ('/funnywords', FunnyWordsPage),
    ('/writing', WritingPage),
    ('/projects', ProjectsPage)
    ], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
