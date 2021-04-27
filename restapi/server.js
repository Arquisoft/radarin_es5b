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
	constructor(addr) {
		this.addr = addr
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
		
		this.server = http.createServer(this.app)
		await this.server.listen(...this.addr)
		console.log("Server has started! port: " + this.addr[1] + ":" + this.addr[0])
	}
	
	async close() {
		await this.server.close()
	}
}

var port = process.env.PORT == null ? 5000 : process.env.PORT
var server = new Server([port, null])

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