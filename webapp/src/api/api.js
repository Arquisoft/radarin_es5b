//REACT_APP_API_URI is an enviroment variable defined in the file .env.development or .env.production
const apiEndPoint = process.env.REACT_APP_API_URI || "http://127.0.0.1:5000"

var sessionId = sessionStorage.getItem("sessionId")
if (sessionId == null)
	sessionId = ""

async function request(path, method, content=null) {
	let response = await fetch(apiEndPoint + path, {
		method: method,
		headers: {"Content-Type": "application/json", "sessionid": sessionId},
		body: content != null ? JSON.stringify(content) : null
	})
	
	return response
}

async function login(webid, pass, coords) {
	let response = await request("/user/login", "POST", {
		"webId": webid,
		"pass": pass,
		"coords": coords
	})
	response = await response.json()
	if (response.sessionId != null) {
		sessionId = response.sessionId
		sessionStorage.setItem("sessionId", sessionId)
	}
	
	return response
}

async function logout() {
	return await request("/user/logout", "GET")
}

async function register(webid) {
	return await request("/user/register", "POST", {"webId": webid})
}

async function addFriends(friends) {
	return await request("/user/add_friends", "POST", friends)
}

async function getFriendsCoords() {
	return await request("/coords/friends", "GET")
}

async function updateCoords(coords) {
	return await request("/coords/update", "POST", {
		coords
	})
}

async function updateRadius(coords) {
	return await request("/radius", "POST", {
		coords
	})
}

async function getNotifications() {
	return await request("/notifications/friends_dist", "GET")
}

async function adminGetUsers() {
	return await request("/admin/users", "GET")
}

async function adminBanUser(webId) {
	return await request("/admin/ban", "POST", {webId})
}

async function adminUnbanUser(webId) {
	return await request("/admin/unban", "POST", {webId})
}

var toExport = {
	login,
	logout,
	register,
	addFriends,
	getFriendsCoords,
	updateCoords,
	updateRadius,
	getNotifications,
	adminGetUsers,
	adminBanUser,
	adminUnbanUser
}
export default toExport