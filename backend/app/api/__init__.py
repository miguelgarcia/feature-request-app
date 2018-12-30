from flask import Blueprint, request, session, jsonify
from flask_login import current_user

from app.models import Area, Client, FeatureRequest

from .schemas import (AreaSchema, ClientSchema, ClientSummarySchema,
                      FeatureRequestSchema, FeatureRequestCreateUpdateSchema,
                      FeatureRequestListArgsSchema)
from .basecrudview import CrudView
from app.apitoken import validate_token

blueprint = Blueprint('api', 'api')

class AuthException(Exception):
    pass

@blueprint.before_request
def before_request():
    if not current_user.is_authenticated:
        raise AuthException()
    try:
        validate_token(request, session)
    except Exception:
        raise AuthException()

@blueprint.errorhandler(AuthException)
def on_auth_error(e):
    return jsonify({'error':'Invalid credentials'}), 401


@blueprint.route('/clients')
def clients():
    clients = Client.query.all()
    return ClientSummarySchema(many=True).jsonify(clients)

@blueprint.route('/clients/<int:id>')
def client(id):
    client = Client.query.get(id)
    if client is None:
        return jsonify(dict(status=404, message='Not found')), 404
    return ClientSchema().jsonify(client)

@blueprint.route('/areas')
def areas():
    areas = Area.query.all()
    return AreaSchema(many=True).jsonify(areas)

class FeatureRequestView(CrudView):
    class Meta:
        model = FeatureRequest
        get_schema = FeatureRequestSchema
        list_schema = FeatureRequestSchema
        list_args_schema = FeatureRequestListArgsSchema
        def put_schema(): return FeatureRequestCreateUpdateSchema(exclude=('client',))
        def post_schema(): return FeatureRequestCreateUpdateSchema(exclude=('is_archived',))

    def list_query(self, session, args):
        q = FeatureRequest.query
        if args.get('client', None) is not None:
            q = q.filter(FeatureRequest.client == args.get('client'))
        if args.get('area', None) is not None:
            q = q.filter(FeatureRequest.area == args['area'])
        if args.get('search', '') != '':
            q = q.filter(FeatureRequest.title.ilike('%{:s}%'.format(args['search'])))
        if not args.get('include_archived', False):
            q = q.filter(FeatureRequest.is_archived == False)

        if args['sort'] == 'id':
            q = q.order_by(FeatureRequest.id)
        elif args['sort'] == 'priority':
            q = q.order_by(FeatureRequest.priority)
        elif args['sort'] == 'target_date':
            q = q.order_by(FeatureRequest.target_date)
        
        return q


def register_crud_view(view_class, plural, list_methods=['GET', 'POST'],
                       record_methods=['GET', 'PUT', 'DELETE']):
    """ Register routes endpoints for a CRUD
        /plural
        /plural/<int:id>

        Allowed methods can be configured using list_methods and record_methods
    """
    view = view_class.as_view(plural)
    if 'GET' in list_methods:
        blueprint.add_url_rule('/{:s}'.format(plural), defaults={'id': None},
                         view_func=view, methods=['GET', ])
    blueprint.add_url_rule('/{:s}/<int:id>'.format(plural), view_func=view,
                     methods=record_methods)
    if 'POST' in list_methods:
        blueprint.add_url_rule('/{:s}'.format(plural), view_func=view, methods=['POST', ])


register_crud_view(FeatureRequestView, 'feature_requests')            
