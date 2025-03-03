from flask import Flask, send_from_directory
from werkzeug.middleware.proxy_fix import ProxyFix
import os

from .api import api


front_dir = '../../front/dist/'


# Main app
app = Flask(__name__, static_folder=front_dir + 'assets')
app.register_blueprint(api, url_prefix='/api')


# Front-end
@app.route('/<path:path>')
@app.route('/', defaults={'path': ''})
def get_front(path):
    if not os.path.exists(front_dir + path):
        path = 'index.html'
    return send_from_directory(front_dir, path)


# Fix for reverse proxy
app.wsgi_app = ProxyFix(app.wsgi_app)
