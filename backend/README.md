# feature request app backend

This app implements a REST API and login for the feature request app

# Local development environment

Configure app settings in app/config.py

    python3 -m venv venv
    . ./venv/bin/activate
    pip install -r requirements.txt
    pip install -e .
    cd app
    fra db upgrade
    fra db populate-db
    
## Run

    . ./venv/bin/activate
    fra run
    
App will be published at http://localhost:5000/

## Run tests

    . ./venv/bin/activate
    python -m pytest
    
