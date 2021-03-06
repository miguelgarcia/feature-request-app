from urllib.parse import  urlparse, urljoin

import flask
from flask import Blueprint, request
from flask_login import login_user, logout_user, login_required

import app
from app.models import User
from app.apitoken import set_token
from .forms import LoginForm

blueprint = Blueprint('auth', 'auth')


def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
           ref_url.netloc == test_url.netloc

@blueprint.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)
    
    if request.method == 'POST' and form.validate():
        user = User.query.filter(User.email == form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            flask.flash('Logged in successfully.')
            next = flask.request.args.get('next')
            # is_safe_url should check if the url is safe for redirects.
            # See http://flask.pocoo.org/snippets/62/ for an example.
            if not is_safe_url(next):
                return flask.abort(400)
            resp = flask.redirect(next or flask.url_for('index'))
            set_token(resp, user)
            return resp
    return flask.render_template('login.html', form=form)

@blueprint.route("/logout")
@login_required
def logout():
    logout_user()
    return flask.redirect('/auth/login')