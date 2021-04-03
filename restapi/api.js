const express = require("express")
const {users, registerUser} = require("./UsersManager")

function checkLogged(req, res, next) {
	if (req.session.webId == null)
		res.send("Error: Not logged")
	
	else
		next()
}

const userRouter = express.Router()
userRouter.use(function(req, res, next) {
	if (req.path == "/login" || req.path == "/register")
		next()
	
	else
		checkLogged(req, res, next)
})

userRouter.post("/login", async (req, res) => {
	if (req.session.webId == null && users.getUser(req.body.webId) == null && await users.loginUser(req.body)) {
		req.session.webId = req.body.webId
		res.send("OK")
	}
	else
		res.send("Error")
})

userRouter.get("/logout", async (req, res) => {
	if (users.logOutUser(req.session.webId)) {
		req.session.webId = null
		res.send("OK")
	}
	else
		res.send("Error")
})

userRouter.post("/register", async (req, res) => {
	if (req.body.webId == null)
		res.send("Error")
	
	else {
		let result = await registerUser(req.body.webId)
		res.send(result == -1 ? "Error" : result)
	}
})

userRouter.post("/add_friends", async (req, res) => {
	res.send(users.getUser(req.session.webId).addFriends(req.body) ? "OK" : "Error")
})

const coordsRouter = express.Router()
coordsRouter.use(checkLogged)

coordsRouter.get("/friends/list", async (req, res) => {
	let user = users.getUser(req.session.webId)
	res.send(user.getFriendsCoords())
})

coordsRouter.post("/update", async (req, res) => {
	users.getUser(req.session.webId).updateCoords(req.body.coords)
	res.send("OK")
})

function getPlaintext(req, res) {
	console.log("En prueba")
	res.send("Holaaaaa que tal???")
}

function getObject(req, res) {
	obj = {"a": "primero", "b": "segundo"}
	res.send(obj)
}

function getXML(req, res) {
	res.format({
		"text/xml": function() {
			res.send("<t1><a /></t1>")
		}
	})
}

function getHTML(req, res) {
	res.send("<html><head></head><body><h1>Título</h1><p>Párrafo 1</p></body></html>")
}

function postObject(req, res) {
	console.log(req.headers)
	console.log(req.body)
	res.send({"status": "recived"})
}

function init(app) {
	app.get("/prueba1", getPlaintext)
	app.get("/getObject", getObject)
	app.get("/getXML", getXML)
	app.get("/getHTML", getHTML)
	
	app.post("/getObject", postObject)
}

module.exports = {userRouter, coordsRouter, init}