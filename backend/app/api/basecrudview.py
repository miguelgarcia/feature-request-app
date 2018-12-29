from flask.views import MethodView
from flask import jsonify, request
from sqlalchemy.exc import IntegrityError
from app import db

class CrudView(MethodView):
    class Meta:
        model = None
        get_schema = None
        list_schema = None
        post_schema = None
        put_schema = None
        list_args_schema = None

    def __new__(cls, *args, **kwargs):
        o = super().__new__(cls)
        o._meta = getattr(o, 'Meta')
        return o

    def list(self):
        args_cleaned = self._meta.list_args_schema().load(request.args)
        q = self.list_query(db.session, args_cleaned)
        results = q.limit(args_cleaned.get('limit')).offset(args_cleaned.get('offset'))
        return (self._meta.list_schema(many=True).jsonify(results),
                200,
                {'x-total-results': q.count()})

    def list_query(self, session, args):
        return self._meta.model.query

    def get(self, id):
        if id is None:
            return self.list()
        o = self._meta.model.query.get(id)
        if o is None:
            return jsonify(dict(status=404, message='Not found')), 404
        return self._meta.get_schema().jsonify(o)

    def _try_commit(self):
        try:
            db.session.commit()
            return None
        except IntegrityError as e:
            db.session.rollback()
            return jsonify({'status': 400, 'message': 'Integrity error'}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'status': 400, 'message': 'DB write error'}), 400

    def post(self):
        json_data = request.get_json()
        if not json_data:
            return jsonify({'status': 400,
                            'message': 'No input data provided'}), 400
        o = self._meta.post_schema().load(json_data)
        db.session.add(o)
        resp = self._try_commit()
        return resp if resp is not None else (jsonify(o.id), 201)

    def delete(self, id):
        o = self._meta.model.query.get(id)
        if o is None:
            return jsonify({'status': 404, 'message': 'Not found'}), 404
        db.session.delete(o)
        resp = self._try_commit()
        return resp if resp is not None else ('', 204)

    def put(self, id):
        o = self._meta.model.query.get(id)
        if o is None:
            return jsonify({'status': 404, 'message': 'Not found'}), 404
        json_data = request.get_json()
        if not json_data:
            return jsonify({'status': 400,
                            'message': 'No input data provided'}), 400
        o = self._meta.put_schema().load(json_data, instance=o)
        resp = self._try_commit()
        return resp if resp is not None else ('', 204)
