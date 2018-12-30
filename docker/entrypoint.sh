#! /usr/bin/env sh
set -e
# Get the maximum upload file size for Nginx, default to 0: unlimited
USE_NGINX_MAX_UPLOAD=${NGINX_MAX_UPLOAD:-0}
# Generate Nginx config for maximum upload file size
echo "client_max_body_size $USE_NGINX_MAX_UPLOAD;" > /etc/nginx/conf.d/upload.conf

# Get the number of workers for Nginx, default to 1
USE_NGINX_WORKER_PROCESSES=${NGINX_WORKER_PROCESSES:-1}
# Modify the number of worker processes in Nginx config
sed -i "/worker_processes\s/c\worker_processes ${USE_NGINX_WORKER_PROCESSES};" /etc/nginx/nginx.conf

# Get the listen port for Nginx, default to 80
USE_LISTEN_PORT=${LISTEN_PORT:-80}

# Explicitly add installed Python packages and uWSGI Python packages to PYTHONPATH
# Otherwise uWSGI can't import Flask
export PYTHONPATH=$PYTHONPATH:/usr/local/lib/python3.6/site-packages:/usr/lib/python3.6/site-packages


cat <<EOF > /etc/nginx/conf.d/nginx.conf
server {
    listen ${USE_LISTEN_PORT};

    location /api {
        try_files \$uri @app;
    }
    
    location /auth {
        try_files \$uri @app;
    }

    location @app {
        include uwsgi_params;
        uwsgi_pass unix:///tmp/uwsgi.sock;
    }

    location / {
        alias /var/www/html/;
        try_files \$uri /index.html;
    }
}
EOF

exec "$@"
