from datetime import datetime

import dateutil
from flask import json

from app import models
from app.tests.utils import model_to_dict


def test_client_list(client, login, client_factory):
    """ Retrieve clients list """
    login()
    clients = client_factory.create_batch(5)
    rv = client.get('/api/clients')
    data = json.loads(rv.data)
    expected = model_to_dict(clients, ['id', 'name'])
    assert expected == data

def test_client_get(client, login, feature_request_factory):
    """ Retrieve a client """
    login()
    fr = feature_request_factory.create()
    rv = client.get('/api/clients/{:d}'.format(fr.client.id))
    data = json.loads(rv.data)
    expected = model_to_dict(fr.client, ['id', 'name'])
    expected['active_feature_requests'] = 1
    assert expected == data

def test_area_list(client, login, area_factory):
    """ Retrieve areas list """
    login()
    areas = area_factory.create_batch(5)
    rv = client.get('/api/areas')
    data = json.loads(rv.data)
    expected = model_to_dict(areas, ['id', 'name'])
    assert expected == data

def test_feature_request_get(client, login, feature_request_factory):
    """ Retrieve a feature request """
    login()
    fr = feature_request_factory.create()
    rv = client.get('/api/feature_requests/{:d}'.format(fr.id))
    data = json.loads(rv.data)
    expected = model_to_dict(fr, ['id', 'title', 'priority', 'description',
        ('area', ['id', 'name']), 'target_date', 'last_update', 'is_archived',
        ('client', ['id', 'name'])
        ])
    expected['client']['active_feature_requests'] = 1
    assert expected == data

def test_feature_request_post(client, login, client_factory, area_factory):
    """ Create a new order """
    login()
    c = client_factory.create()
    area = area_factory.create()
    req = {
        'client': c.id,
        'area': area.id,
        'title': 'A nice title',
        'description': 'bla bla bla',
        'priority': 1,
        'target_date': datetime.now().strftime("%Y-%m-%d")
    }
    rv = client.post('/api/feature_requests', data=json.dumps(req),
                     content_type='application/json')
    assert rv.status_code == 201
    created_id = int(rv.data)
    fr = models.FeatureRequest.query.get(created_id)
    assert fr is not None
    expect = {**req, **{
        'id': created_id,
        'client': {'id': c.id},
        'area': {'id': area.id},
        'is_archived': False,
    }}
    actual = model_to_dict(fr, ['id', 'title', 'priority', 'description',
        ('area', ['id']), 'target_date', 'is_archived',
        ('client', ['id'])
        ])
    created_at = fr.last_update
    assert created_at.timestamp() - datetime.now().timestamp() < 10
    assert actual == expect

def test_feature_request_update(client, login, client_factory, feature_request_factory, area_factory):
    """ Update a feature request """
    login()
    c = client_factory.create()
    frs = feature_request_factory.create_batch(3, client=c)
    new_area = area_factory.create()
    req = {
        'area': new_area.id,
        'title': 'A very nice title',
        'description': 'bla bla bla',
        'priority': 1,
        'is_archived': False,
        'target_date': datetime.now().strftime("%Y-%m-%d")
    }
    fr = frs[1]
    rv = client.put('/api/feature_requests/{:d}'.format(fr.id),
                    data=json.dumps(req), content_type='application/json')
    assert rv.status_code == 204
    expect = req
    expect['id'] = fr.id
    expect['client'] = {'id': c.id}
    expect['area'] = {'id': new_area.id}
    actual = model_to_dict(fr, ['id', 'title', 'priority', 'description',
        ('area', ['id']), 'target_date', 'is_archived',
        ('client', ['id'])
        ])
    assert fr.last_update.timestamp() - datetime.now().timestamp() < 10
    assert actual == expect

def test_feature_requests_list(client, login, client_factory, area_factory, 
    feature_request_factory):
    """ Retrieve feature requests list """
    login()
    c = client_factory.create()
    area = area_factory.create()
    feature_request_factory.create_batch(20)
    feature_request_factory.create_batch(20, client=c)
    frs = feature_request_factory.create_batch(20, client=c, area=area)
    rv = client.get('/api/feature_requests?limit=20&sort=id&area={:d}&client={:d}'.format(area.id, c.id))
    data = json.loads(rv.data)
    frs.sort(key=lambda v: v.id)
    expected = model_to_dict(frs, ['id', 'title', 'priority', 'description',
        ('area', ['id', 'name']), 'target_date', 'is_archived', 'last_update',
        ('client', ['id', 'name'])
        ])
    def insert_active_feature_requests(v):
        v['client']['active_feature_requests']=40
        return v
    expected = list(map(insert_active_feature_requests, expected))
    assert expected == data