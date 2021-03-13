const MongoClient = require("mongodb").MongoClient
const uri = "mongodb://127.0.0.1:5050"

class Mongo {
	constructor() {
		this.client = new MongoClient(uri)
	}
	
	async connect() {
		await this.client.connect()
	}
	
	async getUserById(userWebId) {
		await this.connect()
		let users = this.client.db("users")
		let user = await users.collection("usersId").findOne({webId: userWebId})
		
		await this.client.close()
		return user
	}
}

module.exports = new Mongo()