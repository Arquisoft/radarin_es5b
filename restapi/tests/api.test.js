const server = require("./server-for-tests")
const Requester = require("./requests")

var apiAddr = {
	ip: "127.0.0.1",
	port: 5000
}
var requester = new Requester(apiAddr)

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
	await server.startserver()
})

/**
 * Remove and close the db and server.
 */
afterAll(async done => {
	await server.closeServer() //finish the server
	server.clearDatabase(done)
})

class TestUser {
	constructor(credentials) {
		this.requester = new Requester(apiAddr)
		this.credentials = credentials
	}
	
	checkResponse(res) {
		expect(res.statusCode).toBe(200)
	}
	
	login(expectedRadius, callback) {
		this.requester.request("/user/login", "POST", this.credentials, (res, data) => {
			this.checkResponse(res)
			
			data = JSON.parse(data)
			expect(data.radius).toBe(expectedRadius)
			this.requester.setHeader("sessionid", data.sessionId)
			
			callback()
		})
	}
	
	logout(callback) {
		this.requester.request("/user/logout", "GET", null, (res, data) => {
			this.checkResponse(res)
			callback()
		})
	}
	
	updateCoords(coords, callback) {
		this.requester.request("/coords/update", "POST", {coords}, (res, data) => {
			this.checkResponse(res)
			callback()
		})
	}
	
	checkGetFriendsCoords(expectedCoords, callback) {
		this.requester.request("/coords/friends", "GET", null, (res, data) => {
			this.checkResponse(res)
			
			data = JSON.parse(data).logged
			expect(data.length).toBe(expectedCoords.length)
			
			for (let i = 0; i < expectedCoords.length; i++) {
				expect(data[i].coords.lon).toBe(expectedCoords[i].lon)
				expect(data[i].coords.lat).toBe(expectedCoords[i].lat)
			}
			callback()
		})
	}
	
	addFriends(friends, callback) {
		this.requester.request("/user/add_friends", "POST", friends, (res, data) => {
			this.checkResponse(res)
			callback()
		})
	}
	
	updateRadius(newRadius, callback) {
		this.requester.request("/coords/radius", "POST", {radius: newRadius}, (res, data) => {
			this.checkResponse(res)
			callback()
		})
	}
	
	checkNotifications(expectedUsers, callback) {
		this.requester.request("/notifications/friends_dist", "GET", null, (res, data) => {
			this.checkResponse(res)
			data = JSON.parse(data)
			expect(data.length).toBe(expectedUsers.length)
			
			for (let i = 0; i < expectedUsers.length; i++)
				expect(data[i].webId).toBe(expectedUsers[i])
			
			callback()
		})
	}
}

/**
 * Product test suite.
 */
describe("user", () => {
	var user1Pass = null
	var user2Pass = null
	var coords1 = {lon: 20, lat: 20}
	var coords2 = {lon: 22, lat: 19}
	
	it("can be registered", done => {
		requester.request("/user/register", "POST", {webId: "user1"}, (res, data) => {
			expect(res.statusCode).toBe(200)
			user1Pass = data
			
			requester.request("/user/register", "POST", {webId: "user2"}, (res, data) => {
				expect(res.statusCode).toBe(200)
				user2Pass = data
				done()
			})
		})
	})
	
	it("can login", done => {
		let user1 = new TestUser({webId: "user1", pass: user1Pass, coords: coords1})
		user1.login(1, () => {
			user1.logout(done)
		})
	})
	
	it("not logged can not logout", done => {
		requester.request("/user/logout", "GET", null, (res, data) => {
			expect(res.statusCode).not.toBe(200)
			done()
		})
	})
	
	it("can not register duplicated", done => {
		requester.request("/user/register", "POST", {webId: "user1"}, (res, data) => {
			expect(res.statusCode).not.toBe(200)
			expect(JSON.parse(data).error).toBe("webId already registered")
			done()
		})
	})
	
	it("can update radius", done => {
		let user1 = new TestUser({webId: "user1", pass: user1Pass, coords: coords1})
		
		user1.login(1, () => {
			user1.updateRadius(32.22, () => {
				user1.logout(() => {
					user1.login(32.22, () => {
						user1.logout(done)
					})
				})
			})
		})
	})
	
	it("can send coords to friends and get notified if they are near", done => {
		let user1 = new TestUser({webId: "user1", pass: user1Pass, coords: coords1})
		let user2 = new TestUser({webId: "user2", pass: user2Pass, coords: coords2})
		
		let loginUsers = callback => {
			user1.login(32.22, () => {
				user2.login(1, () => {
					user1.addFriends(["user2"], () => {
						user2.addFriends(["user1"], () => {
							callback()
						})
					})
				})
			})
		}
		
		loginUsers(() => {
			user1.updateCoords({lon: 32.22, lat: -12.2}, () => {
				user2.checkGetFriendsCoords([{lon: 32.22, lat: -12.2}], () => {
					user1.checkGetFriendsCoords([coords2], () => {
						
						user1.checkNotifications([], () => {
							user2.updateCoords({lon: 32.173284, lat: -12.160860}, () => {
								user1.checkNotifications(["user2"], () => {
									user1.logout(() => {
										user2.logout(done)
									})
								})
							})
						})
					})
				})
			})
		})
	})
})