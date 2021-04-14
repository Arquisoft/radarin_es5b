import restapi from "./api";
import pod from "./podAccess";
import auth from "solid-auth-client"
import api from "./api";

var logged = false;

async function getPass(webId) {
	if (webId != null) {
		console.log("web id en getpass:" + webId);
		var url = webId.replace("profile/card#me","");
		url = url + "radarin/contraseña.txt";

		var pass = await(pod.getFile(url));
		console.log("Contraseña sacada"+pass);
		return pass;
	}
}

async function disconnect(){
	console.log("Logout");
	api.logout();
}


async function connect() {
	let webId = (await auth.currentSession()).webId
	
	var response = await restapi.register(webId);
	console.log(response.status);
	if (response.status != 200) { //El usuario ya está registrado
		console.log("Este es el webid" + webId);
		var pass = "aa"//await getPass(webId);
		console.log("Usuario ya está registrado");
		await getLocationLogin(webId,pass);
		update();
	}
	else {
		console.log(response);
		
		var url = webId.replace("profile/card#me","");
	
	 	url = url + "radarin/contraseña.txt";
		console.log(url);
		
		let pass = await response.text()
		pod.updateFile(url, pass);
		await getLocationLogin(webId, pass);
		update();
	}
}


async function update() {
	setTimeout(update,1000);
	 navigator.geolocation.getCurrentPosition(async function f(pos) {
		var coords = {"lat":pos.coords.latitude,"lon":pos.coords.longitude,"alt":0}
		
		//console.log(coords);
		let response = await restapi.updateCoords(coords);
		console.log(await response.text());
	});
}

async function getLocationLogin(webId, pass) {
	await navigator.geolocation.getCurrentPosition(async function f(pos) {
		var coords = {"lat":pos.coords.latitude,"lon":pos.coords.longitude}
		
		console.log("Datos del login: "+webId,pass,coords);
		let response = await restapi.login(webId,pass,coords);

		var friends = await pod.fetchProfile();
		console.log(friends);
		restapi.addFriends(friends);
		
		logged = true
		//console.log("Respuesta del login" + await response.text());
	});
}

function isLogged() {
	return isLogged
}

export default {
	connect,
	isLogged,
	disconnect
}