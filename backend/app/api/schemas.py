from app import ma
from app.models import Client, Area, FeatureRequest
from marshmallow import validate

class ClientSchema(ma.ModelSchema):
    class Meta:
        model = Client
        fields = ('id', 'name', 'active_feature_requests')


class ClientSummarySchema(ma.ModelSchema):
    class Meta:
        model = Client
        fields = ('id', 'name')


class AreaSchema(ma.ModelSchema):
    class Meta:
        model = Area
        fields = ('id', 'name')


class FeatureRequestSchema(ma.ModelSchema):
    class Meta:
        model = FeatureRequest
        fields = ('id', 'title', 'description', 'priority', 'is_archived',
            'target_date', 'last_update', 'client', 'area')

    client = ma.Nested(ClientSchema)
    area = ma.Nested(AreaSchema)

def load_from_id(cls):
    def load(v):
        if isinstance(v, int) or (isinstance(v, str) and v.isnumeric()):
            return cls.query.get(int(v))
        return None            
    return load

class FeatureRequestCreateUpdateSchema(ma.ModelSchema):
    class Meta:
        model = FeatureRequest
        fields = ('title', 'description', 'priority', 
            'target_date', 'client', 'area', 'is_archived')

    client = ma.Function(deserialize=load_from_id(Client), required=True, validate=[validate.NoneOf([None])])
    area = ma.Function(deserialize=load_from_id(Area), required=True, validate=[validate.NoneOf([None])])


class FeatureRequestListArgsSchema(ma.Schema):
    limit = ma.Integer(required=False, validate=[
        validate.Range(1, 100)], missing=20)
    offset = ma.Integer(required=False, validate=[
        validate.Range(0)], missing=0)
    include_archived = ma.Boolean(required=False, missing=False)
    area = ma.Function(deserialize=load_from_id(Area) , required=False)
    client = ma.Function(deserialize=load_from_id(Client), required=True, validate=[validate.NoneOf([None])])
    search = ma.String(required=False)
    sort = ma.String(required=False, validate=[validate.OneOf(['priority', 'id', 'target_date'])], missing='priority')