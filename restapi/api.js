const express = require("express")
const User = require("./models/users")
const router = express.Router()

// Get all users
router.get("/users/list", async (req, res) => {
	const users = await User.find({}).sort('-_id') //Inverse order
	res.send(users)
})

//register a new user
router.post("/users/add", async (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	//Check if the device is already in the db
	let user = await User.findOne({ email: email })
	if (user)
		res.send({error:"Error: This user is already registered"})
	else{
		user = new User({
			name: name,
			email: email,
		})
		await user.save()
		res.send(user)
	}
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

module.exports = {
	router: router,
	init: init
}