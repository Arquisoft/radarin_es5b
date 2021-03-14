const express = require("express")
const users = require("./UsersManager")

const coordsRouter = express.Router()

coordsRouter.get("/friends/list", async (req, res) => {
	let user = users.getUser(req.headers.user)
	res.send(user.getFriendsCoords())
})

coordsRouter.post("/update", async (req, res) => {
	users.getUser(req.body.userSessionId).updateCoords(req.body.coords)
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

module.exports = {coordsRouter, init}