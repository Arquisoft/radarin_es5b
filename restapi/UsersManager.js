const getDistance = require("./coordinates").getDistance

class User {
	constructor(adviseDist) {
		this.coords = null
		this.friends = []
		
		this.adviseDist = adviseDist
	}
	
	updateCoords(coords) {
		this.coords = coords
		let inAdviseDistance = []
		
		for (let friend of this.friends) {
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
		return this.friend.map(friend => friend.coords)
	}
}

class UsersManager {
	
	constructor() {
		this.users = []
	}
	
	addUser(user) {
		
	}
	
	getUser(userId) {
		return this.users[userId]
	}
}

usersManager = new UsersManager()
module.exports = usersManager