#! /bin/sh

while : 
do
    echo Waiting for database
    sleep 10;
    fra db upgrade head
    if [[ $? -eq 0 ]]; then
        echo Database up and migrated
        break
    fi
done

/usr/bin/supervisord