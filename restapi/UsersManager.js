const getDistance = require("./coordinates").getDistance
const db = require("./database")

const DEFAULT_ADVISE_DIST = 0.1

class User {
	
	constructor(webId) {
		this.webId = webId
		
		this.loggedFriends = new Map() //Hash map con los amigos logeados (webId -> User)
		this.loggedOutFriends = new Set() //Set con los webId de los amigos no logeados
		
		this.coords = null
		this.adviseDist = DEFAULT_ADVISE_DIST
	}
	
	logOut() {
		this.loggedFriends.forEach(friend => friend.friendLoggedOut(this))
	}
	
	setCoords(coords) {
		this.coords = coords
	}
	
	setFriends(friendsWebIds) {
		for (let friendWebId of friendsWebIds) {
			let friend = usersManager.users.get(friendWebId)
			
			if (friend != undefined && friend.friendLogged(this))
				this.loggedFriends.set(friendWebId, friend)
			
			else
				this.loggedOutFriends.add(friendWebId)
		}
	}
	
	friendLogged(friend) {
		if (! this.loggedOutFriends.delete(friend.webId))
			return false
		
		else {
			this.loggedFriends.set(friend.webId, friend)
			return true
		}
	}
	
	friendLoggedOut(friend) {
		this.loggedFriends.delete(friend.webId)
		this.loggedOutFriends.add(friend.webId)
	}
	
	updateCoords(coords) {
		this.coords = coords
		console.log(this.coords)
		let inAdviseDistance = []
		
		for (let friend of this.loggedFriends.values()) {
			if (this.inAdviseDistance(friend))
				inAdviseDistance.put(friend)
			
			friend.updateFriendCoords(this)
		}
		return inAdviseDistance
	}
	
	updateFriendCoords(friend) {
		
	}
	
	inAdviseDistance(user) {
		return getDistance(this.coords, user.coords) < this.adviseDist
	}
	
	getFriendsCoords() {
		let friendCoords = []
		for (let friend of this.loggedFriends.values())
			friendCoords.push({webId: friend.webId, coords: friend.coords})
		
		return friendCoords
	}
}

class UsersManager {
	
	constructor() {
		this.users = new Map() //Hash map con los usuarios logeados (webId -> User)
	}
	
	async loginUser(user) {
		let internalUser = await db.getUserById(user.webId)
		
		if (internalUser != null && internalUser.pass == user.pass) {
			let newUser = new User(user.webId)
			this.users.set(user.webId, newUser)
			return true
		}
		else
			return false
	}
	
	logOutUser(webId) {
		let user = this.getUser(webId)
		if (user != null) {
			user.logOut()
			this.users.delete(webId)
			return true
		}
		else
			return false
	}
	
	getUser(webId) {
		let user = this.users.get(webId)
		return user != undefined ? user : null
	}
}

async function registerUser(webId) {
	return await db.addUser(webId);
}

usersManager = new UsersManager();
(async () => console.log(await usersManager.loginUser({webId: "usuario1", pass: 111})))();
(async () => {
	console.log(await usersManager.loginUser({webId: "usuario2", pass: 222}))
	usersManager.users.get("usuario2").loggedOutFriends.add("usuario1")
	usersManager.users.get("usuario1").setCoords({lon: 0, lat: 0, alt: 0})
})();

setTimeout(() => usersManager.users.get("usuario1").setFriends([usersManager.users.get("usuario2").webId]), 500)
module.exports = {users: usersManager, registerUser}