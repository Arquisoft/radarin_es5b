const MongoClient = require("mongodb").MongoClient
const crypto = require("crypto")

const HASHING_ALG = "sha256"
const PASS_SIZE = 128

function getMongoUri() {
	return process.env.MONGO_URI == null ? "mongodb://127.0.0.1:5050" : process.env.MONGO_URI
}

function createRandomPass() {
	let pass = ""
	for (let i = 0; i < PASS_SIZE; i++)
		pass += parseInt(Math.random() * 255).toString(16)
	
	return pass
}

function hashPass(pass) {
	return crypto.createHash(HASHING_ALG).update(pass).digest("hex")
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
		return user != null && user.pass == hashPass(expectedPass)
	}
	
	async addUser(userWebId) {
		await this.connect()
		let usersCol = this.client.db("users").collection("users")
		
		if (await this.getUser(usersCol, userWebId) != null)
			var toReturn = null
		
		else {
			let pass = createRandomPass()
			await usersCol.insertOne({webId: userWebId, pass: hashPass(pass)})
			var toReturn = pass
		}
		await this.client.close()
		return toReturn
	}
}

module.exports = new Mongo()