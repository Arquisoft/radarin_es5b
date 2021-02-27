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

function a(req, res) {
	console.log("En prueba")
	res.send("Holaaaaa que tal???")
}
router.get("/prueba1", a)

function init(app) {
	app.get("/getObject", (req, res) => {
		obj = {"a": "primero", "b": "segundo"}
		res.send(obj)
	})
	
	app.get("/getXML", (req, res) => {
		res.format({
			"text/xml": function() {
				res.send("<t1><a /></t1>")
			}
		})
	})
	
	app.get("/getHTML", (req, res) => {
		res.send("<html><head></head><body><h1>Título</h1><p>Párrafo 1</p></body></html>")
	})
	
	app.post("/getObject", (req, res) => {
		console.log(req.headers)
		console.log(req.body)
		res.send({"status": "recived"})
	})
}
module.exports = {
	router: router,
	init: init
}