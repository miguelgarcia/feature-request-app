import os

full_path = os.path.realpath(__file__)
path, filename = os.path.split(full_path)

default_db = 'postgresql://frapp:frapp@localhost/feature_request'
default_test_db = 'postgresql://frapp:frapp@localhost/feature_requests_test'

class BaseConfig:
    """Base configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'my_secret')
    USER_PASSWORD_SALT = os.getenv('USER_PASSWORD_SALT', 'my_secret')
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', default_db)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
#    SQLALCHEMY_ECHO = True


class DevelopmentConfig(BaseConfig):
    """Development configuration."""
    DEBUG = True


class TestingConfig(BaseConfig):
    """Testing configuration."""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv('TEST_DATABASE_URL', default_test_db)


class ProductionConfig(BaseConfig):
    """Production configuration."""
    DEBUG = False


