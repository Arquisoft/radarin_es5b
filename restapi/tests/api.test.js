const server = require("./server-for-tests")
const Requester = require("./requests")

var apiAddr = {
	ip: "127.0.0.1",
	port: 5000
}

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

/**
 * Product test suite.
 */
describe("user", () => {
	var requester = new Requester()
	var user1Pass = null
	
	it("can be registered", done => {
		requester.request(apiAddr, "/user/register", "POST", {webId: "user1"}, (res, data) => {
			expect(res.statusCode).toBe(200)
			user1Pass = data
			done()
		})
	})
	
	it("can login", done => {
		let credentials = {webId: "user1", pass: user1Pass}
		
		requester.request(apiAddr, "/user/login", "POST", credentials, (res, data) => {
			expect(res.statusCode).toBe(200)
			requester.setHeader("sessionid", JSON.parse(data).sessionId)
			
			requester.request(apiAddr, "/user/logout", "GET", null, (res, data) => {
				expect(res.statusCode).toBe(200)
				done()
			})
		})
	})
	
	it("not logged can not logout", done => {
		requester.request(apiAddr, "/user/logout", "GET", null, (res, data) => {
			expect(res.statusCode).not.toBe(200)
			done()
		})
	})
	
	it("can not register duplicated", done => {
		requester.request(apiAddr, "/user/register", "POST", {webId: "user1"}, (res, data) => {
			expect(res.statusCode).not.toBe(200)
			expect(JSON.parse(data).error).toBe("webId already registered")
			done()
		})
	})
})