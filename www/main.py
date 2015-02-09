'''
Created on Nov 25, 2013

@author: vbrown
'''

import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
from webapp2_extras import jinja2
import logging

class BaseHandler(webapp.RequestHandler):
  @webapp.cached_property
  def jinja2(self):
        return jinja2.get_jinja2(app=self.app)

  def render_template(self, filename, **template_args):
        self.response.write(self.jinja2.render_template(filename, **template_args))


class MainHandler(BaseHandler):
    """Render the main landing page where users can view instructions and create a new one."""
    def get(self, path):
        template_location = os.path.join(
            os.path.dirname(__file__),
            'templates/' + path + '.html')

        if not os.path.isfile(template_location):
            return self.render_template('index.html')

        base = path.split('/')[0]
        return self.render_template(path + '.html', base = base)

application = webapp.WSGIApplication([
    ('/(.*)', MainHandler),
    ], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
