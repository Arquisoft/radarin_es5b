const MongoClient = require("mongodb").MongoClient
const uri = "mongodb://127.0.0.1:5050"

const PASS_SIZE = 128

function createRandomPass() {
	let pass = ""
	for (let i = 0; i < PASS_SIZE; i++)
		pass += parseInt(Math.random() * 255).toString(16)
	
	return pass
}

class Mongo {
	constructor() {
		this.client = new MongoClient(uri)
	}
	
	async connect() {
		await this.client.connect()
	}
	
	async getUser(userIdCollection, userWebId) {
		return await userIdCollection.findOne({webId: userWebId})
	}
	
	async getUserById(userWebId) {
		await this.connect()
		let usersCol = this.client.db("users").collection("users")
		let user = await this.getUser(usersCol, userWebId)
		
		await this.client.close()
		return user
	}
	
	async addUser(userWebId) {
		await this.connect()
		let usersCol = this.client.db("users").collection("users")
		
		if (await this.getUser(usersCol, userWebId) != null)
			var toReturn = -1
		
		else {
			let pass = createRandomPass()
			await usersCol.insertOne({webId: userWebId, pass: pass})
			var toReturn = pass
		}
		await this.client.close()
		return toReturn
	}
}

module.exports = new Mongo()