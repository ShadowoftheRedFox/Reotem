from flask import Blueprint, request, g
import json

from . import emails


# api blueprint and helpers

api = Blueprint('api', __name__)

def success(data, status=200, **kwargs):
    json_data = json.dumps({'success': True, 'data': data, **kwargs}, default=str)
    return json_data, status, {'Content-Type': 'application/json'}

def error(message, status=400, **kwargs):
    json_data = json.dumps({'success': False, 'error': message, **kwargs}, default=str)
    return json_data, status, {'Content-Type': 'application/json'}


# parse all args from url and form
@api.url_value_preprocessor
def url_value_preprocess(endpoint, values):
    g.args = {}
    for k in request.args.keys():
        key, value = get_arg(request.args, k)
        g.args[key] = value
    for k in request.form.keys():
        key, value = get_arg(request.form, k)
        g.args[key] = value

def get_arg(multidict, key):
    if key.endswith('[]'):
        if multidict.get(key) == '\x00':
            return key[0:-2], []
        return key[0:-2], multidict.getlist(key)
    else:
        if multidict.get(key) == '\x00':
            return key, None
        return key, multidict.get(key)


# CORS
@api.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


# emails
api.register_blueprint(emails.blueprint, url_prefix='/emails')
