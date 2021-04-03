const express = require("express")
const expressSession = require('express-session')

const http = require("http")
const https = require("https")
const fs = require("fs")
//const promBundle = require("express-prom-bundle");
const cors = require('cors');
//const mongoose = require("mongoose")
const api = require("./api")

class Server {
	constructor(addrHttp, addrHttps) {
		this.addrHttp = addrHttp
		this.addrHttps = addrHttps
	}
	
	start() {
		this.app = express()
		
		this.app.use(expressSession({
			secret: 'abcdefg',
			resave: true,
			saveUninitialized: true
		}))
		
		this.app.use(cors());
		this.app.options('*', cors());
		this.app.use(express.json())
		this.app.use("/user", api.userRouter)
		this.app.use("/coords", api.coordsRouter)
		api.init(this.app)
		
		let credentials = {
			key: fs.readFileSync("httpsCert/key.pem", "utf-8"),
			cert: fs.readFileSync("httpsCert/cert.pem", "utf-8"),
			passphrase: "test123..."
		}
		this.server = http.createServer(this.app).listen(...this.addrHttp, () => this.serverStarted(this.addrHttp))
		this.serverHttps = https.createServer(credentials, this.app).listen(...this.addrHttps, () => this.serverStarted(this.addrHttps))
		/*this.server = this.app.listen(...this.addr, () => )*/
	}
	
	serverStarted(addr) {
		console.log("Server has started! port: " + addr[1] + ":" + addr[0])
	}
}

server = new Server([5000, "127.0.0.1"], [5001, "127.0.0.1"])
server.start()