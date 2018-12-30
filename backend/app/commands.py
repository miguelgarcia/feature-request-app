import os

import click
from app import create_app
from flask.cli import FlaskGroup

@click.group(cls=FlaskGroup, create_app=create_app)
@click.option('--debug', is_flag=True, default=False)
def cli(debug):
    if debug:
        os.environ['FLASK_DEBUG'] = '1'


@cli.command()
def populate_db():
    """ Populates the database with random data """
    import app.tests.fixtures as fixtures
    import random
    user = fixtures.UserFactory.create(email='admin@example.com', password='fraAdmin2019')
    clients = fixtures.ClientFactory.create_batch(5)
    areas = fixtures.AreaFactory.create_batch(4)
    for c in clients:
        for a in areas:
            fixtures.FeatureRequestFactory.create_batch(random.randint(1,10), client=c, area=a)