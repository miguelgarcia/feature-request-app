FROM node:latest

COPY frontend/src /frontend/src
COPY frontend/package.json /frontend/
COPY frontend/package-lock.json /frontend/
COPY frontend/.babelrc /frontend/
COPY frontend/webpack.config.js /frontend/

WORKDIR frontend
RUN npm install
RUN npm run build

FROM tiangolo/uwsgi-nginx:python3.6-alpine3.7

RUN rm -rf /app
COPY backend/app /app
COPY backend/setup.py /
COPY backend/requirements.txt /

RUN apk update \
  && apk add --no-cache --virtual build-deps gcc python3-dev musl-dev \
  && apk add postgresql-dev \
  && pip3 install --upgrade pip \
  && pip3 install --trusted-host pypi.python.org -r /requirements.txt \
  && pip3 install -e / \
  && apk del build-deps

ENV NGINX_WORKER_PROCESSES auto

COPY backend/app/wsgi.py /
COPY docker/uwsgi.ini /app
COPY docker/start.sh /
RUN chmod +x /start.sh
COPY docker/entrypoint.sh /
RUN chmod +x /entrypoint.sh

COPY --from=0 /frontend/dist /var/www/html
WORKDIR /app

CMD ["/start.sh"]
