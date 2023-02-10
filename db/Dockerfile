FROM postgres:alpine

# Install app dependencies
COPY SDC_CSV /data
COPY CreateQATables.sql /docker-entrypoint-initdb.d/

#App binds to port 8080 so you have to expose to have it mapped by docker daemon
EXPOSE 6666
