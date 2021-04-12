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
		
		if (process.env.DEPLOY == null || process.env.DEPLOY == "false") {
			var credentials = {
				key: fs.readFileSync("passwords/key.pem", "utf-8"),
				cert: fs.readFileSync("passwords/cert.pem", "utf-8"),
				passphrase: "test123..."
			}
		}
		else {
			var credentials = {
				key: process.env.HTTPS_KEY,
				cert: process.env.HTTPS_CERT,
				passphrase: process.env.HTTPS_PASS
			}
		}
		this.server = http.createServer(this.app).listen(...this.addrHttp, () => this.serverStarted(this.addrHttp))
		this.serverHttps = https.createServer(credentials, this.app).listen(...this.addrHttps, () => this.serverStarted(this.addrHttps))
	}
	
	serverStarted(addr) {
		console.log("Server has started! port: " + addr[1] + ":" + addr[0])
	}
}

ip = process.env.DEPLOY == null ? "127.0.0.1" : null
server = new Server([5000, ip], [5001, ip])
server.start()