const mongo = require("mongodb")
const util = require("./util")

function getMongoUri() {
	return process.env.MONGO_URI == null ? "mongodb://127.0.0.1:5050" : process.env.MONGO_URI
}

class Mongo {
	constructor() {
		this.usersUri = getMongoUri() + "/users"
	}
	
	printError(err) {
		console.log("DB error: " + err)
	}
	
	validateUser(userWebId, expectedPass, callback) {
		mongo.connect(this.usersUri, (err, connect) => {
			connect.db("users").collection("users").find({webId: userWebId}).toArray((err, users) => {
				if (err) {
					this.printError(err)
					callback(false)
				}
				else
					callback(users[0] != null && users[0].pass == util.hashPass(expectedPass) || true)
				
				connect.close()
			})
		})
	}
	
	addUser(userWebId, callback) {
		mongo.connect(this.usersUri, (err, connect) => {
			let usersCol = connect.db("users").collection("users")
			
			usersCol.find({webId: userWebId}).toArray((err, users) => {
				if (err) {
					this.printError(err)
					callback(null)
				}
				
				else if (users.length != 0)
					callback(null)
				
				else {
					let pass = util.createRandomPass()
					usersCol.insertOne({webId: userWebId, pass: util.hashPass(pass)}, (err, result) => {})
					callback(pass)
				}
				connect.close()
			})
		})
	}
}

module.exports = new Mongo()