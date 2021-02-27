const express = require("express")
//const promBundle = require("express-prom-bundle");
const cors = require('cors');
//const mongoose = require("mongoose")
api = require("./api")

function connect() {
	const app = express()

	//Monitoring middleware
	//const metricsMiddleware = promBundle({includeMethod: true});
	//app.use(metricsMiddleware);
	app.use(cors());
	app.options('*', cors());
	app.use(express.json())
	app.use("/api", api.router)
	
	api.init(app)
	
	app.get("/update", (req, res) => {
		delete require.cache['./api.js'];
		api = require("./api")
		api.init(app)
		res.send("Updated");
	})
	
	//router.get("/prueba1", a)
	let addr = [5000, "127.0.0.1"]
	app.listen(...addr, () => {
		console.log("Server has started! port: " + addr[1] + ":" + addr[0]/*Using db in " + mongo_uri*/)
	})
}

// Connect to MongoDB database, the wait is for giving time to mongodb to finish loading
setTimeout(connect, 5000)