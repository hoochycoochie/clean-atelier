

## Description
clean atelier test is done based on nestjs framework
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
Inspired by [Medium](https://medium.com/@jonathan.pretre91/clean-architecture-with-nestjs-e089cef65045) Clean architecture with Nestjs Jonathan Pretre medium


## Project setup
docker-compose version 1.29.2
nodejs version : 22.13.0
```bash
$ npm install
```


## Compile and run the project with docker, 
make sure you have Makefile installed (make), at least you have node version 22.13.0, docker and docker-compose
```bash
# create these following directories to persist postgres and mongodb data during the application run
$ mkdir mongodbvolume postgresvolume

# open a terminal and wait until all images are build, and all containers started,
$ make start

# open a new another terminal and run the sql migrations
$ make migratesql

# once the api-container is restarted 
# the swagger is then available at http://localhost:3000/api 

```
 

 ## Compile and run the project locally: change .env file
To run the application , you will need to install nodejs version : 22.13.0, mongodb:8 and postgres:17,
and make sure to  add credentials in .env file

```bash
# to run all unit tests
$ npm run test
# test coverage
$ npm run test:cov
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```

 

 