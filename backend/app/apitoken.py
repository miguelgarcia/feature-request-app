from flask import request, session, current_app
from flask_login import current_user
import hashlib
import random

def api_token(f):
    """ Checks a valid api token header is set in the request """
    def wrapper(*args, **kw):
        if 'x-api-token' not in request.headers:
            raise Exception('No token provided')
        if request.headers['x-api-token'] != session['x-api-token']:
            raise Exception('Invalid token provided')
        return f(*args, **kw)
    wrapper.__name__ = f.__name__
    return wrapper

def set_token(resp, user):
    token = hashlib.sha1(str(random.random()).encode('utf-8') + current_app.config['SECRET_KEY'].encode('utf-8')).hexdigest()
    session['x-api-token'] = token
    resp.set_cookie('x-api-token', token)