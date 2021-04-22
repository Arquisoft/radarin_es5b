const util = require("./util")

class SessionManager {
	constructor() {
		this.sessions = new Map()
	}
	
	newSession(data) {
		let sessionId = util.createRandomPass()
		this.sessions.set(sessionId, data)
		
		return sessionId
	}
	
	delete(req) {
		this.sessions.delete(req.headers.sessionid)
	}
	
	setReqSession(req, res, next) {
		if (req.headers.sessionid != null)
			req.session = this.sessions.get(req.headers.sessionid)
		
		if (req.session == null)
			req.session = {}
		
		next()
	}
}

module.exports = new SessionManager()