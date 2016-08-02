

## Docker
[optional] add docker's ip (got from `docker-machine env` 
ip address only, without port or tcp://) to /etc/hosts file 
(or replace in following commands docker with that ip)


Run web app
`docker-compose run --service-ports web nodemon`

Want to connect directly to the db?
`mongo docker:27017`

