import datetime
import hashlib

from flask import current_app
from sqlalchemy import event, func, select
from sqlalchemy.ext.hybrid import hybrid_property

from app import db

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False, unique=True)

    def __init__(self, *arg, **kw):
        if 'password' in kw:
            kw['password'] = User._encrypt_password(kw['password'])
        super().__init__(*arg, **kw)

    @staticmethod
    def _encrypt_password(password):
        if password is None:
            return ""
        return hashlib.sha1(password.encode('utf-8') + current_app.config['USER_PASSWORD_SALT'].encode('utf-8')).hexdigest()

    def check_password(self, password):
        return User._encrypt_password(password) == self.password

    def is_authenticated(self):
        return True
 
    def is_active(self):
        return True
 
    def is_anonymous(self):
        return False
 
    def get_id(self):
        return self.email

    def __repr__(self):
        return self.email


class Client(db.Model):
    __tablename__ = 'client'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode(100), nullable=False, unique=True)

    def __repr__(self):
        return self.name

    @hybrid_property
    def active_feature_requests(self):
        return self.feature_requests.filter(FeatureRequest.is_archived == False).count()


class Area(db.Model):
    __tablename__ = 'area'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode(100), nullable=False, unique=True)

    def __repr__(self):
        return self.name


class FeatureRequest(db.Model):
    __tablename__ = 'feature_request'
    #__table_args__ = (db.UniqueConstraint('client_id', 'priority', name='uix_client_priority'), )
    id = db.Column(db.Integer, primary_key=True)
    is_archived = db.Column(db.Boolean, default=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.UnicodeText())
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'),
                            nullable=False)
    client = db.relationship('Client', backref=db.backref('feature_requests', lazy='dynamic'), lazy='selectin')
    area_id = db.Column(db.Integer, db.ForeignKey('area.id'), nullable=False)
    area = db.relationship('Area', backref=db.backref('feature_requests', lazy='dynamic'), lazy='selectin')
    target_date = db.Column(db.Date, nullable=False)
    priority = db.Column(db.Integer, nullable=False)
    last_update = db.Column(db.DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now, nullable=False)

    def __repr__(self):
        return '#{:d} {:s}'.format(self.id if self.id is not None else 0, self.title)

    @hybrid_property
    def due(self):
        return datetime.date.now() > self.target_date

    @staticmethod
    def count_active_by_client(client):
        """ Returns how many feature request does the client have. """
        return FeatureRequest.query.filter(FeatureRequest.client == client).\
            filter(FeatureRequest.is_archived == False).\
            count()
    
    @staticmethod
    def between_priorities_query(client, from_priority, to_priority=None):
        """ Return a query that filters all the feature request for a client
            with priority values between from_priority and to_priority
        """
        q = FeatureRequest.query.filter(FeatureRequest.client == client).\
            filter(FeatureRequest.priority >= from_priority).\
            filter(FeatureRequest.is_archived == False)
        if to_priority is not None:
            q = q.filter(FeatureRequest.priority <= to_priority)
        return q

    @staticmethod
    def increment_priority(client, from_priority, to_priority=None):
        """ Increment priorities for all feature request that belong to
        the client and have priority values between from_priority and
        to_priority """
        FeatureRequest.between_priorities_query(client, from_priority, 
            to_priority).\
            update({'priority': FeatureRequest.priority+1})

    @staticmethod
    def decrement_priority(client, from_priority, to_priority=None):
        """ Decrement priorities for all feature request that belong to
        the client and have priority values between from_priority and
        to_priority """
        FeatureRequest.between_priorities_query(client, from_priority, 
            to_priority).\
            update({'priority': FeatureRequest.priority-1})

    def compute_priority(self):
        """ This method is called before persisting a feature request to
        maintain the list of priorities for a client without holes and without
        duplicates. """
        requests_count = FeatureRequest.count_active_by_client(self.client)
        self.priority = max(self.priority, 1) # Priorities go from 1
        # Max value = feature requests count for the client
        if self.id is None:
            # Creation
            self.priority = min(self.priority, requests_count+1)
            # create hole: increment priority of every FeatureRequest of this 
            # client with priority >= self.priority
            if not self.is_archived:
                FeatureRequest.increment_priority(self.client, self.priority)
        else:
            self.priority = min(self.priority, requests_count)
            state = db.inspect(self)

            hist = state.get_history(state.attrs.priority.key, True)
            old_priority = self.priority
            if hist.deleted != ():
                old_priority = hist.deleted[0]

            # Is archived changed ?
            hist = state.get_history(state.attrs.is_archived.key, True)
            if hist.added != () or hist.deleted != ():
                # is_archived changed
                if self.is_archived:
                    FeatureRequest.decrement_priority(self.client, old_priority+1)
                else:
                    FeatureRequest.increment_priority(self.client, old_priority)
            
            hist = state.get_history(state.attrs.priority.key, True)
            if hist.added == () or hist.added is None or hist.deleted == () or hist.deleted is None:
                return # Priority not changed
            # Priority was changed
            old_priority = hist.deleted[0]
            new_priority = hist.added[0]
            if self.priority < old_priority:
                # Elements in [new_priority, old_priority-1]
                # are shifted upwards to make place
                FeatureRequest.increment_priority(self.client, new_priority,
                    to_priority=old_priority-1)
            elif new_priority > old_priority:
                # Elements in [old_priority+1, new_priority]
                # are shifted downwards to make place
                FeatureRequest.decrement_priority(self.client, old_priority+1,
                    to_priority=new_priority)
            self.priority = new_priority

@event.listens_for(FeatureRequest, 'before_insert')
def handle_compute_priority(mapper, conn, target):
    target.compute_priority()

@event.listens_for(FeatureRequest, 'before_update')
def handle_compute_priority(mapper, conn, target):
    target.compute_priority()

# class CustomersManager:
#     @staticmethod
#     def count_by_country():
#         country = aliased(Country, name='country')
#         return (
#             db.session.query(
#                 country,
#                 label('count', func.count(Customer.id))
#             )
#             .outerjoin(country.customers)
#             .group_by(country.id)
#             .order_by(country.id)
#             .all()
#         )
