
class DistNotifications {
	constructor() {
		this.clear()
	}
	
	add(friend) {
		this.notifications.push(friend)
	}
	
	clear() {
		this.notifications = []
	}
}

module.exports = DistNotifications