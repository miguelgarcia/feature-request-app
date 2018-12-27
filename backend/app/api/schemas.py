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

    client = ma.Nested(ClientSummarySchema)
    area = ma.Nested(AreaSchema)


class FeatureRequestCreateUpdateSchema(ma.ModelSchema):
    class Meta:
        model = FeatureRequest
        fields = ('title', 'description', 'priority', 'is_archived',
            'target_date', 'last_update', 'client', 'area')

    client = ma.Function(deserialize=lambda v: Client.query.get(
        v), required=True, validate=[validate.NoneOf([None])])
    area = ma.Function(deserialize=lambda v: Area.query.get(
        v), required=True, validate=[validate.NoneOf([None])])


class FeatureRequestListArgsSchema(ma.Schema):
    limit = ma.Integer(required=False, validate=[
        validate.Range(1, 100)], missing=20)
    offset = ma.Integer(required=False, validate=[
        validate.Range(0)], missing=0)
    include_archived = ma.Boolean(required=False, missing=True)
    area = ma.Function(deserialize=lambda v: Area.query.get(
        v), required=False)
    client = ma.Function(deserialize=lambda v: Client.query.get(
        v), required=True, validate=[validate.NoneOf([None])])
    search = ma.String(required=False)
    sort = ma.String(required=False, validate=[validate.OneOf(['priority', 'id', 'target_date'])], missing='priority')