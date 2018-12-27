from flask import json
from app import models
from sqlalchemy.exc import IntegrityError

def test_client_cant_repeat_priority(client_factory, feature_request_factory):
    """ Test a client can't have more than one feature request for the same
        priority """
    client = client_factory.create()
    exception = False
    frs = feature_request_factory.create_batch(2, client=client, priority=1)

    assert [f.priority for f in frs] == [2, 1], "A client can't have more than one feature request for the same"

def test_two_client_can_share_priority(client_factory, feature_request_factory):
    """ Test two clients can use the same priority """
    frs = []
    for client in client_factory.create_batch(2):
        frs.append(feature_request_factory.create(client=client, priority=1))
    assert [f.priority for f in frs] == [1,1] , "Two clients can use the same priority"

def test_priority_between_1_and_n(client_factory, feature_request_factory):
    """ Test a that a clients priorities are always between 1 and #Feature requests """
    client = client_factory.create()
    frs = feature_request_factory.create_batch(10, client=client, priority=20)
    assert [f.priority for f in frs] == list(range(1,11)) , "Priorities are assigned between 1 and # feature requests"

def test_change_priority_to_1(db_session, client_factory, feature_request_factory):
    """ Test a reorder priorities, moving one item as first """
    client = client_factory.create()

    original_order = []
    for i in range(1, 11):
        original_order.append(feature_request_factory.create(client=client, priority=i).id)

    fr = models.FeatureRequest.query.get(original_order[5])
    fr.priority = 1
    db_session.commit()

    expected_order = [original_order[5]] + original_order[:5] + original_order[6:]

    ordered = models.FeatureRequest.query.\
        filter(models.FeatureRequest.client==client).\
        order_by(models.FeatureRequest.priority).\
        all()

    actual_order = [fr.id for fr in ordered]
    assert actual_order == expected_order, "Priorities are resorted when moving to priority 1"

def test_change_priority_to_n(db_session, client_factory, feature_request_factory):
    """ Test a reorder priorities, moving one item as last """
    client = client_factory.create()

    original_order = []
    for i in range(1, 11):
        original_order.append(feature_request_factory.create(client=client, priority=i).id)

    fr = models.FeatureRequest.query.get(original_order[5])
    fr.priority = 10
    db_session.commit()

    expected_order = original_order[:5] + original_order[6:] + [original_order[5]]

    ordered = models.FeatureRequest.query.\
        filter(models.FeatureRequest.client==client).\
        order_by(models.FeatureRequest.priority).\
        all()

    actual_order = [fr.id for fr in ordered]
    assert actual_order == expected_order, "Priorities are resorted when moving to item to last place"

    
def test_change_priority_up(db_session, client_factory, feature_request_factory):
    """ Test a reorder priorities, incrementing an item priority value """
    client = client_factory.create()

    original_order = []
    for i in range(1, 11):
        original_order.append(feature_request_factory.create(client=client, priority=i).id)

    fr = models.FeatureRequest.query.get(original_order[5])
    fr.priority = 8
    db_session.commit()

    original_order.pop(5)
    expected_order = original_order[:7] + [fr.id] + original_order[7:]
    

    ordered = models.FeatureRequest.query.\
        filter(models.FeatureRequest.client==client).\
        order_by(models.FeatureRequest.priority).\
        all()

    actual_order = [fr.id for fr in ordered]
    assert actual_order == expected_order, "Priorities are resorted when moving to item up"
    
def test_change_priority_down(db_session, client_factory, feature_request_factory):
    """ Test a reorder priorities, decrementing an item priority value """
    client = client_factory.create()

    original_order = []
    for i in range(1, 11):
        original_order.append(feature_request_factory.create(client=client, priority=i).id)

    fr = models.FeatureRequest.query.get(original_order[5])
    fr.priority = 3
    db_session.commit()

    original_order.pop(5)
    expected_order = original_order[:2] + [fr.id] + original_order[2:]

    ordered = models.FeatureRequest.query.\
        filter(models.FeatureRequest.client==client).\
        order_by(models.FeatureRequest.priority).\
        all()

    actual_order = [fr.id for fr in ordered]
    assert actual_order == expected_order, "Priorities are resorted when moving to item down"

# case delete !?