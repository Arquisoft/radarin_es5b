const express = require("express")
const sessionManager = require("./SessionManager")
const {users, registerUser} = require("./UsersManager")
const db = require("./database")

var admins = new Set()
db.getAdmins(dbAdmins => admins = new Set(dbAdmins))

function sendError(res, errorDesc=null) {
	res.status(400)
	res.send(errorDesc != null ? {error: errorDesc} : {})
}

function checkLogged(req, res, next) {
	if (req.session.webId == null)
		sendError(res, "Not logged")
	
	else
		next()
}

const userRouter = express.Router()
userRouter.use((req, res, next) => {
	if (req.path === "/login" || req.path === "/register")
		next()
	
	else
		checkLogged(req, res, next)
})

userRouter.post("/login", (req, res) => {
	if (req.body.webId != null && req.body.pass != null) {
		if (req.session.webId == null) {
			users.loginUser(req.body, (result, radius) => {
				if (result)
					res.send({
						sessionId: sessionManager.newSession({webId: req.body.webId}),
						radius
					})
				
				else
					sendError(res, "Login error")
			})
		}
		else
			sendError(res, "Login error")
	}
	else
		sendError(res, "Invalid request")
})

userRouter.get("/logout", (req, res) => {
	if (users.logOutUser(req.session.webId)) {
		sessionManager.delete(req)
		res.send({})
	}
	else
		sendError(res, "Not logged")
})

userRouter.post("/register", (req, res) => {
	if (req.body.webId == null)
		sendError(res, "Invalid request")
	
	else {
		registerUser(req.body.webId, (registered, msg) => {
			if (registered)
				res.send(msg)
			
			else
				sendError(res, msg)
		})
	}
})

userRouter.post("/add_friends", (req, res) => {
	let result = users.getUser(req.session.webId).addFriends(req.body)
	if (result != null)
		res.send(result)
	
	else
		sendError(res, "Invalid request")
})

const coordsRouter = express.Router()
coordsRouter.use(checkLogged)

coordsRouter.get("/friends", (req, res) => {
	let user = users.getUser(req.session.webId)
	res.send(user.getFriendsCoords())
})

coordsRouter.post("/update", (req, res) => {
	users.getUser(req.session.webId).updateCoords(req.body.coords)
	res.send("OK")
})

coordsRouter.post("/radius", (req, res) => {
	users.getUser(req.session.webId).updateRadius(req.body.radius, () => res.send({}))
})

const notificationsRouter = express.Router()
notificationsRouter.use(checkLogged)

notificationsRouter.get("/friends_dist", (req, res) => {
	let user = users.getUser(req.session.webId)
	res.send(user.getDistNotifications())
})

const adminRouter = express.Router()
adminRouter.use(checkLogged)

adminRouter.use((req, res, next) => {
	if (admins.has(req.session.webId))
		next()
	
	else
		sendError(res, "Logged user is not admin")
})

adminRouter.get("/users", (req, res) => {
	db.listUsersAdmin(res.send.bind(res))
})

adminRouter.post("/ban", (req, res) => {
	db.banUser(req.body.webId)
	res.send({})
})

adminRouter.post("/unban", (req, res) => {
	db.unbanUser(req.body.webId)
	res.send({})
})

module.exports = {
	userRouter,
	coordsRouter,
	notificationsRouter,
	adminRouter
}