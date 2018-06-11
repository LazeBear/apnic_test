FROM mysql:5

ENV MYSQL_ROOT_PASSWORD 123
ENV MYSQL_DATABASE apnic
ENV MYSQL_USER apnic
ENV MYSQL_PASSWORD apnic

ADD apnic_data.sql /docker-entrypoint-initdb.d
