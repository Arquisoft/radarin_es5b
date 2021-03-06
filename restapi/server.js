const express = require("express")
const promBundle = require("express-prom-bundle")

const http = require("http")
const cors = require("cors")

const sessionManager = require("./SessionManager")
const api = require("./api")

class Server {
	constructor(addr) {
		this.addr = addr
	}
	
	async start() {
		this.app = express()
		
		//Monitoring middleware
		const metricsMiddleware = promBundle({includeMethod: true})
		this.app.use(metricsMiddleware)

		this.app.use(cors())
		this.app.options("*", cors())
		this.app.use(express.json())
		this.app.use(sessionManager.setReqSession.bind(sessionManager))
		this.app.use("/user", api.userRouter)
		this.app.use("/coords", api.coordsRouter)
		this.app.use("/notifications", api.notificationsRouter)
		this.app.use("/admin", api.adminRouter)
		
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

if (require.main === module)
	server.start()

module.exports = server