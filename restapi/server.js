const express = require("express")
//const promBundle = require("express-prom-bundle");
const cors = require('cors');
//const mongoose = require("mongoose")
const api = require("./api")

class Server {
	constructor(addr) {
		this.addr = addr
	}
	
	start() {
		this.app = express()
		
		this.app.use(cors());
		this.app.options('*', cors());
		this.app.use(express.json())
		this.app.use("/coords", api.coordsRouter)
		
		this.server = this.app.listen(...this.addr, () => {
			console.log("Server has started! port: " + this.addr[1] + ":" + this.addr[0])
		})
	}
}

server = new Server([5000, "127.0.0.1"])
server.start()