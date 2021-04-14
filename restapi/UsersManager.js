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
		this.loggedFriends.set(friend.user.webId, friend)
		this.updateFriendCoords_me(friend, getDistance(this.coords, friendUser.coords))
	}
	
	addFriends(friendsWebIds) {
		if (! (Symbol.iterator in Object(friendsWebIds)))
			return false
		
		for (let friendWebId of friendsWebIds) {
			let friend = usersManager.users.get(friendWebId)
			
			if (friend != undefined && friend.friendLogged(this))
				this.addLoggedFriend(friend)
			
			else
				this.loggedOutFriends.add(friendWebId)
		}
		console.log(this.loggedFriends)
		console.log(this.loggedOutFriends)
		return true
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
			friend.user.updateFriendCoords(this.webId, dist)
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
		this.loggedFriends.get(friendWebId).dist = dist
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
	
	loginUser(user, callback) {
		
		db.validateUser(user.webId, user.pass, added => {
			if (added) {
				let newUser = new User(user.webId, user.coords)
				this.users.set(user.webId, newUser)
			}
			callback(added)
		})
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

function registerUser(webId, callback) {
	db.addUser(webId, callback)
}

usersManager = new UsersManager();
usersManager.loginUser({webId: "usuario1", pass: "111", coords: {lon: 0, lat: 0, alt: 0}}, resp => {
	console.log(resp)
	
	usersManager.loginUser({webId: "usuario2", pass: "222", coords: {lon: 0, lat: 5, alt: 0}}, resp2 => {
		console.log(resp2)
		
		usersManager.users.get("usuario2").addFriends([usersManager.users.get("usuario1").webId])
		usersManager.users.get("usuario1").addFriends([usersManager.users.get("usuario2").webId, "usuario3"])
		console.log(usersManager.users.get("usuario1").getFriendsCoords())
	})
})

module.exports = {users: usersManager, registerUser}