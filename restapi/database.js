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
	
	checkNotInCollection(collection, searchObj, callback) {
		collection.find(searchObj).toArray((err, users) => {
			if (err) {
				this.printError(err)
				callback(false)
			}
			else
				callback(users.length === 0)
		})
	}
	
	addUser(userWebId, radius, callback) {
		mongo.connect(this.usersUri, (err, connect) => {
			let usersDB = connect.db(getDBName("users"))
			let usersCol = usersDB.collection("users")
			
			this.checkNotInCollection(usersCol, {webId: userWebId}, userNotFound => {
				if (userNotFound) {
					this.checkNotInCollection(usersDB.collection("banned"), {webId: userWebId}, banNotFound =>  {
						
						if (banNotFound) {
							let pass = util.createRandomPass()
							usersCol.insertOne({
								webId: userWebId,
								pass: util.hashPass(pass),
								radius
							}, (err, result) => connect.close())
							
							callback(true, pass)
						}
						else {
							callback(false, "Banned user")
							connect.close()
						}
					})
				}
				else {
					callback(false, "webId already registered")
					connect.close()
				}
			})
		})
	}
	
	deleteAllUsers(callback) {
		mongo.connect(this.usersUri, (err, connect) => {
			connect.db(getDBName("users")).collection("users").remove({}, () => {
				callback()
				connect.close()
			})
		})
	}
	
	updateRadius(webId, radius, callback) {
		mongo.connect(this.usersUri, (err, connect) => {
			let usersCol = connect.db(getDBName("users")).collection("users")
			usersCol.update({webId}, {$set: {radius}}, () => {
				callback()
				connect.close()
			})
		})
	}
	
	getAdmins(callback) {
		mongo.connect(this.usersUri, (err, connect) => {
			let usersDB = connect.db(getDBName("users"))
			usersDB.collection("admins").find({}).toArray((err, admins) => {
				if (err) {
					this.printError(err)
					callback([])
				}
				else {
					callback(admins.map(admin => admin.webId))
				}
				connect.close()
			})
		})
	}
	
	listUsersAdmin(callback) {
		mongo.connect(this.usersUri, (err, connect) => {
			let usersDB = connect.db(getDBName("users"))
			
			usersDB.collection("users").find({}).toArray((err, users) => {
				usersDB.collection("banned").find({}).toArray((err, bannedUsers) => {
					
					let getWebId = user => user.webId
					callback({users: users.map(getWebId), banned: bannedUsers.map(getWebId)})
					
					connect.close()
				})
			})
		})
	}
	
	banUser(webIdToBan) {
		mongo.connect(this.usersUri, (err, connect) => {
			let usersDB = connect.db(getDBName("users"))
			
			usersDB.collection("users").remove({webId: webIdToBan}, () => {
				let bannedCol = usersDB.collection("banned")
				bannedCol.insertOne({webId: webIdToBan}, (err, result) => connect.close())
			})
		})
	}
	
	unbanUser(webIdToUnban) {
		mongo.connect(this.usersUri, (err, connect) => {
			let usersDB = connect.db(getDBName("users"))
			usersDB.collection("banned").remove({webId: webIdToUnban}, () => connect.close())
		})
	}
}

module.exports = new Mongo()