import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_login import LoginManager

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
login_manager = LoginManager()

def create_app(options={}):
    if 'TESTING' in options and options['TESTING']:
        config_name = 'app.config.TestingConfig'
    else:
        config_name = os.getenv(
            'APP_SETTINGS',
            'app.config.DevelopmentConfig'
        )
    app = Flask(__name__)
    app.config.from_object(config_name)
    init_extensions(app)
    register_blueprints(app)
    return app


def init_extensions(app):
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    from . import models  # To make models available to alembic

    @login_manager.user_loader
    def user_loader(email):
        return models.User.query.filter(email==email).first()


def register_blueprints(app):
    from app.auth import blueprint as auth_bp
    from app.api import blueprint as api_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    @app.route('/')
    def index():
        return "hello"
    #from project.restapi import api
    #app.register_blueprint(api, url_prefix='/api')
