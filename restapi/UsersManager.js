const getDistance = require("./coordinates").getDistance
const db = require("./database")

class User {
	constructor(adviseDist) {
		this.coords = null
		this.friends = []
		
		this.adviseDist = adviseDist
	}
	
	updateCoords(coords) {
		this.coords = coords
		console.log(this.coords)
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
		return this.friends.map(friend => friend.coords)
	}
}

class UsersManager {
	
	constructor() {
		this.users = []
	}
	
	async loginUser(user) {
		let internalUser = await db.getUserById(user.webId)
		if (internalUser.id == user.id) {
			this.users.push(new User())
			return this.users.length - 1
		}
		else
			return -1
	}
	
	getUser(userId) {
		return this.users[userId]
	}
}

usersManager = new UsersManager();
(async () => console.log(await usersManager.loginUser({webId: "usuario1", id: 111})))();
(async () => console.log(await usersManager.loginUser({webId: "usuario2", id: 222})))();

setTimeout(() => usersManager.users[0].friends.push(usersManager.users[1]), 500)
module.exports = usersManager