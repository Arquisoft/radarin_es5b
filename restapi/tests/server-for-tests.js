const db = require("../database")
const restapiServer = require("../server")

module.exports.startserver = async () => {
	process.env.TEST = "true"
	await restapiServer.start()
}

module.exports.closeServer = async () => {
	await restapiServer.close()
}

module.exports.clearDatabase = done => {
	db.deleteAllUsers(done)
}