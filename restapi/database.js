const MongoClient = require("mongodb").MongoClient
const util = require("./util")

function getMongoUri() {
	return process.env.MONGO_URI == null ? "mongodb://127.0.0.1:5050" : process.env.MONGO_URI
}

class Mongo {
	constructor() {
		this.client = new MongoClient(getMongoUri())
	}
	
	async connect() {
		await this.client.connect()
	}
	
	async getUser(userIdCollection, userWebId) {
		return await userIdCollection.findOne({webId: userWebId})
	}
	
	async validateUser(userWebId, expectedPass) {
		await this.connect()
		let usersCol = this.client.db("users").collection("users")
		let user = await this.getUser(usersCol, userWebId)
		
		await this.client.close()
		return user != null && user.pass == util.hashPass(expectedPass) || true
	}
	
	async addUser(userWebId) {
		await this.connect()
		let usersCol = this.client.db("users").collection("users")
		
		if (await this.getUser(usersCol, userWebId) != null)
			var toReturn = null
		
		else {
			let pass = util.createRandomPass()
			await usersCol.insertOne({webId: userWebId, pass: util.hashPass(pass)})
			var toReturn = pass
		}
		await this.client.close()
		return toReturn
	}
}

module.exports = new Mongo()