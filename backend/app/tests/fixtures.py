import pytest
from app import create_app, db, models
import factory
from .factoryboyfixture import make_fixture

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture(scope='session')
def app():
    _app = create_app({'TESTING': True})
    ctx = _app.app_context()
    ctx.push()
    yield _app
    ctx.pop()

@pytest.fixture(scope="session")
def _db(app):
    """
    Returns session-wide initialised database.
    """
    db.drop_all()
    db.create_all()
    return db

@pytest.fixture
def login(client, user_factory):
    def logmein():
        user = user_factory.create()
        client.post('/auth/login', data=dict(email=user.email, 
            password='12345678'), follow_redirects=True)
        return user
    return logmein

@make_fixture()
class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.User
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = 'commit'

    email = factory.Faker('email')
    password = '12345678'

@make_fixture()
class ClientFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.Client
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = 'commit'

    name = factory.Sequence(lambda n: 'Client {:d}'.format(n))


@make_fixture()
class AreaFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.Area
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = 'commit'

    name = factory.Sequence(lambda n: 'Area {:d}'.format(n))


@make_fixture(uses=[ClientFactory, AreaFactory])
class FeatureRequestFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.FeatureRequest
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = 'commit'

    title = factory.Faker('sentence')
    description = factory.Faker('text')
    client = factory.SubFactory(ClientFactory)
    area = factory.SubFactory(AreaFactory)
    target_date = factory.Faker('future_date')
    priority = 1
    is_archived = False
