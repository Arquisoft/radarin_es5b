const getDistance = require("./coordinates").getDistance
const DistNotifications = require("./notifications")
const db = require("./database")

const DEFAULT_ADVISE_DIST = 0.1

class Friend {
	constructor(friend) {
		this.user = friend
		this.dist = 0
		this.inAdviseDist = false
	}
}

class User {
	
	constructor(webId, coords) {
		this.webId = webId
		
		this.loggedFriends = new Map() //Hash map con los amigos logeados (webId -> Friend)
		this.loggedOutFriends = new Set() //Set con los webId de los amigos no logeados
		
		this.coords = coords
		this.adviseDist = DEFAULT_ADVISE_DIST
		this.distNotifications = new DistNotifications()
	}
	
	logOut() {
		this.loggedFriends.forEach(friend => friend.user.friendLoggedOut(this))
	}
	
	setCoords(coords) {
		this.coords = coords
	}
	
	addLoggedFriend(friendUser) {
		let friend = new Friend(friendUser)
		this.loggedFriends.set(friend.webId, friend)
		this.updateFriendCoords_me(friend, getDistance(this.coords, friendUser.coords))
	}
	
	setFriends(friendsWebIds) {
		for (let friendWebId of friendsWebIds) {
			let friend = usersManager.users.get(friendWebId)
			
			if (friend != undefined && friend.friendLogged(this))
				this.addLoggedFriend(friend)
			
			else
				this.loggedOutFriends.add(friendWebId)
		}
	}
	
	friendLogged(friend) {
		if (! this.loggedOutFriends.delete(friend.webId))
			return false
		
		else {
			this.addLoggedFriend(friend)
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
		
		for (let friend of this.loggedFriends.values()) {
			let dist = getDistance(this.coords, friend.user.coords)
			this.updateFriendCoords_me(friend, dist)
			friend.updateFriendCoords(this, dist)
		}
	}
	
	updateFriendCoords_me(friend, dist) {
		friend.dist = dist
		
		if (this.inAdviseDistance(dist) != friend.inAdviseDist) {
			friend.inAdviseDist = ! friend.inAdviseDist
			
			if (friend.inAdviseDist)
				this.distNotifications.add(friend)
		}
	}
	
	updateFriendCoords(friendWebId, dist) {
		this.updateFriendCoords(this.loggedFriends.get(friendWebId, dist))
	}
	
	inAdviseDistance(dist) {
		return dist < this.adviseDist
	}
	
	getFriendsCoords() {
		let friendCoords = []
		for (let friend of this.loggedFriends.values()) {
			let friendUser = friend.user
			
			friendCoords.push({
				webId: friendUser.webId,
				coords: friendUser.coords,
				dist: friend.dist,
				inAdviseDist: friend.inAdviseDist
			})
		}
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
			let newUser = new User(user.webId, user.coords)
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
(async () => console.log(await usersManager.loginUser({webId: "usuario1", pass: 111, coords: {lon: 0, lat: 0, alt: 0}})))();
(async () => {
	console.log(await usersManager.loginUser({webId: "usuario2", pass: 222, coords: {lon: 0, lat: 5, alt: 0}}))
	usersManager.users.get("usuario2").setFriends([usersManager.users.get("usuario1").webId])
	usersManager.users.get("usuario1").setFriends([usersManager.users.get("usuario2").webId])
	console.log(usersManager.users.get("usuario1").getFriendsCoords())
})();

module.exports = {users: usersManager, registerUser}