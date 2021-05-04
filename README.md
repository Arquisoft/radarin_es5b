![CI for radarin](https://github.com/arquisoft/radarin_es5b/workflows/CI%20for%20radarin/badge.svg)
[![codecov](https://codecov.io/gh/Arquisoft/radarin_es5b/branch/master/graph/badge.svg?token=GSUNKWG4FK)](https://codecov.io/gh/Arquisoft/radarin_es5b)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/52d7486a4dd6457c96d34771e8de7391)](https://www.codacy.com/gh/Arquisoft/radarin_es5b/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Arquisoft/radarin_es5b&amp;utm_campaign=Badge_Grade)


# To Do before run the application
This application uses the solid pod for saving the locations, this usually cause problems with permissons and different things. 
The fastest option for solve it is to do the things in the [video](https://www.youtube.com/watch?v=wY2hHqtZi_g&ab_channel=EricAlmeda).
We are trying to discover another more private and secure alternative but at this moment this is the best option.



# Radarin project structure
Link to the deployed sample application: [radarines5b](https://radarines5bwebapp.herokuapp.com/). Note that sometimes **it can take a while to load** because Heroku in the free plan, takes the containers to sleep when they are not used for some time and taking them up takes time.



## Quick start guide
If you want to execute the project you will need [git](https://git-scm.com/downloads), [Node.js and npm](https://www.npmjs.com/get-npm) and [Docker](https://docs.docker.com/get-docker/). Make sure the three of them are installed in your system. Download the project with `git clone https://github.com/arquisoft/radarin_es5b`. The fastest way to launch everything is with docker:
```sh
docker-compose up --build
```
This will create two docker images as they don't exist in your system (the webapp and the restapi) and launch a mongo container database. It will also launch Prometheus and Grafana containers to monitor the webservice. You should be able to access everything from here:
-   [Webapp - http://localhost:3000](http://localhost:3000)
-   [Docs - http://localhost:3000/docs](http://localhost:3000/docs)
-   [RestApi example call - http://localhost:5000/api/users/list](http://localhost:5000/user/logout)
-   [RestApi raw metrics - http://localhost:5000/metrics](http://localhost:5000/metrics)
-   [Prometheus server - http://localhost:9090](http://localhost:9090)
-   [Grafana server http://localhost:9091](http://localhost:9091)

If you want to run it without docker you will need mongodb installed in your machine, and the /bin folder, in the mongo installation, added to the path.

To start the database run this:
```sh
mkdir mongo/data
cd mongo
mongod --bind_ip 127.0.0.1 --port 5050 --dbpath ./data
```

Compile and run the web app:
```sh
cd webapp
npm install
npm start
```
Now the webservice:
```sh
cd restapi
npm install
npm start
```
You should be able to access the application in [http://localhost:3000](http://localhost:3000) and the documentation in [http://localhost:3000/docs](http://localhost:3000/docs)

### Colaboradores
-   Antonio Fernández Flambó
-   Eric Almeda Tomás
-   Álex Caso Díaz
-   Ignacio González Sánchez
-   Daniel Pérez Prádanos