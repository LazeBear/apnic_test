#!/bin/sh

# Run the MySQL container, with a database named 'users' and credentials
# for a users-service user which can access it.
echo "Starting DB..."
docker run --name db -d \
  -e MYSQL_ROOT_PASSWORD=123 \
  -e MYSQL_DATABASE=users -e MYSQL_USER=apnic -e MYSQL_PASSWORD=apnic \
  -p 3306:3306 \
  mysql:latest

# Wait for the database service to start up.
echo "Waiting for DB to start up..."
docker exec db mysqladmin --silent --wait=30 -uapnic -papnic ping || exit 1

# Run the setup script.
echo "Setting up initial data..."
docker exec -i db mysql -uapnice -papnic users < apnic_data.sql
