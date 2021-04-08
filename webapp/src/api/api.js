//REACT_APP_API_URI is an enviroment variable defined in the file .env.development or .env.production
const apiEndPoint = process.env.REACT_APP_API_URI || "http://127.0.0.1:5000"

async function request(path, method, content={}) {
	let response = await fetch(apiEndPoint + path, {
		method: method,
		headers: {"Content-Type":"application/json"},
		body: JSON.stringify(content)
	})
	return response
}

async function login(webid, pass, coords) {
	return await request("/user/login", "POST", {
		"webId": webid,
		"pass": pass,
		"coords": coords
	})
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
	return await request("/coords/friends/list", "GET")
}

async function updateCoords() {
	return await request("/coords/update", "POST", {
		"coords": {
			"long": 36.25,
			"lat": -5.5421564,
			"alt": 10
		}
	})
}

export default {
	login,
	logout,
	register,
	addFriends,
	getFriendsCoords,
	updateCoords
}