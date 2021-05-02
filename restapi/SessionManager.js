const util = require("./util")

class SessionManager {
	constructor() {
		this.sessions = new Map() //session -> webId
		this.reverseSessions = new Map() //webId -> session
	}
	
	newSession(data) {
		let previousSession = this.reverseSessions.get(data.webId)
		if (previousSession != null) {
			this.sessions.delete(previousSession)
			this.reverseSessions.delete(data.webId)
		}
		
		let sessionId = util.createRandomPass()
		this.sessions.set(sessionId, data)
		this.reverseSessions.set(data.webId, sessionId)
		
		return sessionId
	}
	
	delete(req) {
		this.reverseSessions.delete(this.sessions.get(req.headers.sessionid).webId)
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