from app import create_app

def test_config():
    """ Test testing attribute is True when the create_app option TESTING is
        True  """
    assert create_app({'TESTING': True}).testing
