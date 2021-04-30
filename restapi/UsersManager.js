const getDistance = require("./coordinates").getDistance
const db = require("./database")

const DEFAULT_ADVISE_DIST = 1

class Friend {
	constructor(friend) {
		this.user = friend
		this.dist = 0
		this.inAdviseDist = false
	}
	
	toApiFormat() {
		return {
			webId: this.user.webId,
			coords: this.user.coords,
			dist: this.dist,
			inAdviseDist: this.inAdviseDist
		}
	}
}

class User {
	
	constructor(webId, coords, radius) {
		this.webId = webId
		
		this.loggedFriends = new Map() //Hash map con los amigos logeados (webId -> Friend)
		this.loggedOutFriends = new Set() //Set con los webId de los amigos no logeados
		
		this.coords = coords
		this.adviseDist = radius
		this.distNotifications = []
	}
	
	/**
	 * Deslogea al usuario
	 */
	logOut() {
		this.loggedFriends.forEach(friend => friend.user.friendLoggedOut(this))
	}
	
	/**
	 * Cambia el valor del radio de aviso y le almacena en la base de datos para proximos logeos
	 * @param {number} newRadius Nuevo valor del radio de aviso
	 */
	updateRadius(newRadius) {
		this.adviseDist = newRadius
		
		for (let friend of this.loggedFriends.values()) {
			let dist = getDistance(this.coords, friend.user.coords)
			this.updateFriendCoords(friend, dist)
		}
		db.updateRadius(this.webId, newRadius)
	}
	
	/**
	 * Añade una lista de amigos a los amigos cargados en el servidor
	 * Actualiza las distancias entre los amigos que están logeados
	 * @param {Array} friendsWebIds Lista con los webId de los amigos a añadir
	 * @return {Array} Lista con los WebId de los amigos que no de han podido añadir por no ser amigos mutuamente
	 */
	addFriends(friendsWebIds) {
		if (! (Symbol.iterator in Object(friendsWebIds)))
			return null
		
		let notMutualFriends = new Array()
		
		for (let friendWebId of friendsWebIds) {
			let friend = usersManager.users.get(friendWebId)
			
			if (friend != undefined) {
				if (friend.friendLogged(this))
					this.addLoggedFriend(friend)
				
				else {
					this.loggedOutFriends.add(friendWebId)	
					notMutualFriends.push(friendWebId)
				}
			}
			
			else
				this.loggedOutFriends.add(friendWebId)
		}
		console.log(this.loggedFriends)
		console.log(this.loggedOutFriends)
		return notMutualFriends
	}
	
	/**
	 * Añade el amigo indicado a la lista de los logeados, calculando su distancia con el usuario
	 * @param {User} friendUser Usuario para añadir a la lista de amigos logeados
	 */
	addLoggedFriend(friendUser) {
		let friend = new Friend(friendUser)
		this.loggedFriends.set(friend.user.webId, friend)
		this.updateFriendCoords(friend, getDistance(this.coords, friendUser.coords))
	}
	
	/**
	 * Se llama cuando un amigo se ha logeado
	 * @param {User} friend Amigo que se ha logeado
	 * @return {bool} Si se ha podido añadir a los amigos logeados por ser amigos mutuamente
	 */
	friendLogged(friend) {
		if (this.loggedOutFriends.delete(friend.webId)) {
			this.addLoggedFriend(friend)
			return true
		}
		
		else
			return false
	}
	
	/**
	 * Se llama cuando un amigo se ha deslogeado
	 * @param {User} friend Amigo que se ha deslogueado
	 */
	friendLoggedOut(friend) {
		this.loggedFriends.delete(friend.webId)
		this.loggedOutFriends.add(friend.webId)
	}
	
	/**
	 * Actualiza las coordenas del usuario y las distancias con sus amigos
	 * @param {Coords} coords Nuevas coordenadas del usuario {lon, lat, alt}
	 */
	updateCoords(coords) {
		this.coords = coords
		
		for (let friend of this.loggedFriends.values()) {
			let dist = getDistance(this.coords, friend.user.coords)
			
			this.updateFriendCoords(friend, dist)
			friend.user.updateFriendCoordsWebId(this.webId, dist)
		}
	}
	
	/**
	 * Actualiza las coordenadas del amigo indicado
	 * @param {Friend} friend Amigo a actualizar la distancia
	 * @param {number} dist Distancia entre el usuario y el amigo en km
	 */
	updateFriendCoords(friend, dist) {
		friend.dist = dist
		
		if (this.inAdviseDistance(dist) != friend.inAdviseDist) {
			friend.inAdviseDist = ! friend.inAdviseDist
			
			if (friend.inAdviseDist)
				this.distNotifications.push(friend)
		}
	}
	
	/**
	 * Actualiza las coordenadas del amigo con el WebId indicado
	 * @param {String} friendWebId WebId del amigo a actualizar las coordenadas
	 * @param {number} dist Distancia entre los amigos
	 */
	updateFriendCoordsWebId(friendWebId, dist) {
		this.updateFriendCoords(this.loggedFriends.get(friendWebId), dist)
	}
	
	/**
	 * @param {number} dist Distancia para comprbar si está en el rango de aviso
	 * @return {bool} Si la distancia es menor que la distancia de aviso configurada
	 */
	inAdviseDistance(dist) {
		return dist < this.adviseDist
	}
	
	/**
	 * Devuelve los datos de las coordenadas de los amigos logeados
	 * @return {Array}
	 * {
	 * webId: WebId del amigo,
	 * coords: Coordenadas del amigo,
	 * dist: Distancia entre los amigos en km,
	 * inAdviseDist: Si el amigo está en la distancia de aviso configurada en el usuario
	 * }
	 */
	getFriendsCoords() {
		let friendCoords = []
		for (let friend of this.loggedFriends.values())
			friendCoords.push(friend.toApiFormat())
		
		return friendCoords
	}
	
	/**
	 * Devuelve los amigos que han entrado en el radio de aviso desde la última llamada
	 * Cada elemento devuelto contiene los mismos datos que en la llamada a getFriendsCoords
	 * @return {Array} Lista de amigos que han entrado en en radio de aviso
	 */
	getDistNotifications() {
		let toReturn = this.distNotifications.map(not => not.toApiFormat())
		this.distNotifications = []
		return toReturn
	}
}

class UsersManager {
	
	constructor() {
		this.users = new Map() //Hash map con los usuarios logeados (webId -> User)
	}
	
	loginUser(user, callback) {
		
		db.validateUser(user.webId, user.pass, (valid, radius) => {
			if (valid) {
				let newUser = new User(user.webId, user.coords, radius)
				this.users.set(user.webId, newUser)
			}
			callback(valid, radius)
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
	db.addUser(webId, DEFAULT_ADVISE_DIST, callback)
}

var usersManager = new UsersManager()
module.exports = {users: usersManager, registerUser}