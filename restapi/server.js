const express = require("express")

const http = require("http")
const https = require("https")
const fs = require("fs")
//const promBundle = require("express-prom-bundle");
const cors = require('cors');
//const mongoose = require("mongoose")
const sessionManager = require("./SessionManager")
const api = require("./api")
const usersManager = require("./UsersManager").users

class Server {
	constructor(addrHttp, addrHttps) {
		this.addrHttp = addrHttp
		this.addrHttps = addrHttps
	}
	
	async start() {
		this.app = express()
		
		this.app.use(cors());
		this.app.options('*', cors());
		this.app.use(express.json())
		this.app.use(sessionManager.setReqSession.bind(sessionManager))
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
		this.server = http.createServer(this.app)
		await this.server.listen(...this.addrHttp)
		this.serverStarted(this.addrHttp)
		
		this.serverHttps = https.createServer(credentials, this.app)
		await this.serverHttps.listen(...this.addrHttps)
		this.serverStarted(this.addrHttps)
	}
	
	serverStarted(addr) {
		console.log("Server has started! port: " + addr[1] + ":" + addr[0])
	}
	
	async close() {
		await this.server.close()
		await this.serverHttps.close()
	}
}

var ip = process.env.DEPLOY == null ? "127.0.0.1" : null
var server = new Server([5000, ip], [5001, ip])

if (require.main == module) {
	server.start()
	
	usersManager.loginUser({webId: "usuario1", pass: "111", coords: {lon: 0, lat: 0, alt: 0}}, resp => {
	console.log(resp)
	
	usersManager.loginUser({webId: "usuario2", pass: "222", coords: {lon: 0, lat: 5, alt: 0}}, resp2 => {
		console.log(resp2)
		
		usersManager.users.get("usuario2").addFriends([usersManager.users.get("usuario1").webId])
		usersManager.users.get("usuario1").addFriends([usersManager.users.get("usuario2").webId, "usuario3"])
		console.log(usersManager.users.get("usuario1").getFriendsCoords())
	})
})
}

module.exports = server