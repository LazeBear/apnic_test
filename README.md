# Full stack excersise

All data are download from ftp://ftp.apnic.net/public/apnic/stats/apnic/delegated-apnic-latest

## Instructions

### Prerequisites

Docker [Install Docker](https://www.docker.com/community-edition)

Docker Compose [Install Docker Compose](https://docs.docker.com/compose/install/) - (On desktop systems like Docker for Mac and Windows, Docker Compose is included as part of those desktop installs.)

### Steps to build this app

Navigate in terminal to the folder with docker-compose.yml file.

Type the following command:

```
docker-compose build
```

Then

```
docker-compose up
```

These commands will create two containers, one running the database microservice (MySQL) and the other one running the server microservice (Node.js)

## Running the app

### API

Following APIs supported:

1. Get the total asn for a country in a particular year

    For example, get the total asn for China in 2016

    http://localhost:4201/api/asn/2016/CN

    Or, get the total asn for all country in 2016

    http://localhost:4201/api/asn/2016/ALL

2. Get the distinct years

    http://localhost:4201/api/years

3. Get the distinct countries

    http://localhost:4201/api/countries


### Web Interface

Access this link to visualise the data in graph

http://localhost:4201/graph


### Note

It might take 1 - 2 minutes to fully import the data into the database. You can track the importing process in the console.

## Built with

* [Docker](https://www.docker.com/community-edition) - Package the app
* [Node.js](https://nodejs.org/en/) - Sever
* [Angular 6](https://angular.io/) - Front end
* [MySQL](https://www.mysql.com/) - Database

### Other libraries used

* [promise-ftp](https://github.com/realtymaps/promise-ftp) - Communicate with ftp sever
* [line-reader](https://github.com/nickewing/line-reader) - Read the data file line by line
* [ngx-charts](https://github.com/swimlane/ngx-charts) - Visualise data