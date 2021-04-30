## The rest api
The objective for this part is to make a rest API using Express, Node.js and MongoDB as the database (mongodb for accessing it). We will implement here all the logic about coordinates sharing with friends.

Lets start creating the directory `restapi` and installing the tools to make a nodejs webservice there:
```sh
mkdir restapi
cd restapi
npm init -y
npm install express
```
Now lets run the database. To run this you need to install mongo db from the official [site](https://www.mongodb.com/try/download/community), we recommend installing the community version (is required to have the /bin folder, in the mongo installation, added to the path).
```sh
mkdir mongo/data
cd mongo
mongod --bind_ip 127.0.0.1 --port 5050 --dbpath ./data
```
The code is quite straight forward, the [server.js](restapi/server.js) file launchs the api and connects to the mongo database using mongodb. The [api.js](restapi/api.js) is actually the api, where you could see all api's entry points to manage the users and it's coordinates in the server.

### Testing the rest api
In this part we will use the mongo database we've launched previously. Also we need something for making the api requests, in this case we are using node http library

The idea is to use Jest (as in the webapp) as the main testing framework to run the tests against the api. For making the get or post petitions we are going to use node http library. The [api.test.js](restapi/tests/api.test.js), has the implementation of the tests.

After configuring the tests in the `package.json` we can run them using `npm run test`

### Docker image for the rest api
In this case the web service depends on the mongo database. What we are going to do is create a Dockerfile that will be responsible for loading the ws and then, a general docker-compose that will load everything in order (database, webservice, webapp, and also the monitoring software).

Check the `docker-compose.yaml` to understand how each service is created and loaded.

<mark>With the current configuration is not possible to run each container alone (it also does not make sense, as all the parts are dependent). When we execute everything with docker-compose, a network between containers is created and we can access one from another using the local container IP. This is how the restapi connects with the mongo server for instance.</mark>

## Monitoring (Prometheus and Grafana)
In this step we are going use [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/) to monitor the restapi. First step is modifying the restapi launch to capture profiling data. In nodejs this is very easy. First install the required packages:

```sh
npm install prom-client express-prom-bundle
```

Then, modify the `restapi/server.js` in order to capture the profiling data adding:
```js
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);
```
Now when we launch the api, in [http://localhost:5000/metrics](http://localhost:5000/metrics) we have a metrics endpoint from which get the profiling data. The idea here is to have another piece of software running (called [Prometheus](https://prometheus.io/)) that will get this data, let say, every five seconds. Then, another software called [Grafana](https://grafana.com/) will display this using beautiful charts.

For running Prometheus and Grafana we can use several docker images. Check `docker-compose.yaml` to see how these images are launched. 

<mark>Note: in the `prometheus.yml` we are telling prometheus where is our restapi metrics end point. In Grafana `datasources/datasource.yml` we are telling where to find prometheus data.</mark>

<mark>In both configuration files we need to stablish the uris of restapi metrics and the prometheus datasource. Right now they are configured to work using docker-compose network. If you want to use these individual docker commands, you need to change these uris to point to localhost</mark>

Once launched all the system is launched (see the Quick Start Guide), we can simulate a few petitions to our webservice:

```sh
sudo apt-get install apache2-utils
ab -m GET -n 10000 -c 100 http://localhost:5000/user/logout
```
In the Grafana dashboard we can see how the number of petitions increases dramatically after the call.

A good reference with good explanations about monitoring in nodejs can be found [here](https://github.com/coder-society/nodejs-application-monitoring-with-prometheus-and-grafana).