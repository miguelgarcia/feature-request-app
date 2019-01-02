#! /bin/sh

while : 
do
    fra db upgrade head
    if [[ $? -eq 0 ]]; then
        echo Database up and migrated
        break
    fi
    echo Waiting for database
    sleep 10;
done

/usr/bin/supervisord