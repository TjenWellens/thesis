

## Docker
[optional] add docker's ip (got from `docker-machine env` 
ip address only, without port or tcp://) to /etc/hosts file 
(or replace in following commands docker with that ip)

### Run the app in docker, yeey!

Run web app
`docker-compose run --service-ports web nodemon`

Want to connect directly to the db?
`mongo docker:27017`

### Docker for Development!
okay...
docker compose isn't ideal for development
```
docker build -t tjenwellens/experiment .
docker run -p 27017:27017 -d --name db mongo
docker run -it --publish=3000:3000 --link db:db_1 --volume=MY_PATH:/opt/experiment tjenwellens/experiment bash
```

replace `MY_PATH` by the path where you cloned this repo
this way your folder will be shared with the docker instance
You will need to reinstall node modules
```
rm -rf node_modules
npm install
```
because the node modules are os-dependant.

now you can run the server with nodemon `nodemon`, easy right?

### Problems with ports that are locked?
`docker-compse down`