# Build frontend
FROM node:latest

COPY frontend/src /frontend/src
COPY frontend/package*.json /frontend/
COPY frontend/.babelrc /frontend/
COPY frontend/webpack.config.js /frontend/

WORKDIR frontend
RUN npm install \
  && npm run build

# Build server image
FROM tiangolo/uwsgi-nginx:python3.6-alpine3.7

# Install frontend
COPY --from=0 /frontend/dist /var/www/html

# Install app
RUN rm -rf /app
COPY backend/app /app
COPY backend/setup.py /
COPY backend/requirements.txt /

# Install dependencies
RUN apk update \
  && apk add --no-cache --virtual build-deps gcc python3-dev musl-dev \
  && apk add postgresql-dev \
  && pip3 install --upgrade pip \
  && pip3 install --trusted-host pypi.python.org -r /requirements.txt \
  && pip3 install -e / \
  && apk del build-deps

# Configure uwsgi and nginx
COPY docker /docker
RUN cp /app/wsgi.py / \
  && cp /docker/app_uwsgi.ini /app/uwsgi.ini \
  && cp /docker/uwsgi.ini /etc/uwsgi \
  && cp /docker/start.sh / \
  && cp /docker/entrypoint.sh / \
  && rm -rf /docker \
  && chmod 777 /etc/nginx /var/log /run /app /var/cache/nginx /etc/nginx/conf.d \
  && chmod 666 /etc/nginx/nginx.conf /etc/nginx/conf.d/*.conf /etc/supervisord.conf

#COPY backend/app/wsgi.py /
#COPY docker/app_uwsgi.ini /app/uwsgi.ini
#COPY docker/uwsgi.ini /etc/uwsgi
#COPY docker/start.sh /
#COPY docker/entrypoint.sh /


CMD ["/start.sh"]
