# feature-request-app

This is a demo project with a frontend built using knockout.js and the backend
built using flask.

The application allows the user to manage feature requests made by clients.

See online demo here: [Visit](https://mike-feature-request-app.herokuapp.com/)

Default user is: `admin@example.com`, password: `fraAdmin2019`

See more info for the frontend and backend in the `README.md` file of each directory.

# Build docker image

    docker build -t fra .

# Run using docker-compose

    docker-compose up

## Populate DB

    docker-compose exec app sh
    fra populate-db

Default user is: `admin@example.com`, password: `fraAdmin2019`
