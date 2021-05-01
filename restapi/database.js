const mongo = require("mongodb")
const util = require("./util")

function getMongoUri() {
	return process.env.MONGO_URI == null ? "mongodb://127.0.0.1:5050" : process.env.MONGO_URI
}

function getDBName(dbName) {
	return process.env.TEST !== "true" ? dbName : "test_" + dbName
}

class Mongo {
	constructor() {
		this.usersUri = getMongoUri()
	}
	
	printError(err) {
		console.log("DB error: " + err)
	}
	
	validateUser(userWebId, expectedPass, callback) {
		mongo.connect(this.usersUri, (err, connect) => {
			connect.db(getDBName("users")).collection("users").find({webId: userWebId}).toArray((err, users) => {
				if (err) {
					this.printError(err)
					callback(false)
				}
				else {
					let validated = users[0] != null && users[0].pass === util.hashPass(expectedPass)
					callback(validated, validated ? users[0].radius : 0)
				}
				
				connect.close()
			})
		})
	}
	
	addUser(userWebId, radius, callback) {
		mongo.connect(this.usersUri, (err, connect) => {
			let usersCol = connect.db(getDBName("users")).collection("users")
			
			usersCol.find({webId: userWebId}).toArray((err, users) => {
				if (err) {
					this.printError(err)
					callback(null)
				}
				
				else if (users.length !== 0)
					callback(null)
				
				else {
					let pass = util.createRandomPass()
					usersCol.insertOne({
						webId: userWebId,
						pass: util.hashPass(pass),
						radius: radius
					}, (err, result) => {})
					
					callback(pass)
				}
				connect.close()
			})
		})
	}
	
	deleteAllUsers(callback) {
		mongo.connect(this.usersUri, (err, connect) => {
			connect.db(getDBName("users")).collection("users").remove({}, () => callback())
			connect.close()
		})
	}
	
	updateRadius(webId, radius) {
		mongo.connect(this.usersUri, (err, connect) => {
			let usersCol = connect.db(getDBName("users")).collection("users")
			usersCol.update({webId: webId}, {$set: {radius: radius}}, () => connect.close())
		})
	}
}

module.exports = new Mongo()