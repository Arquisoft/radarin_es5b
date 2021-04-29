import restapi from "./api";
import pod from "./podAccess";
import auth from "solid-auth-client"

var logged = false;


/*async function getPass(webId) {
	if (webId != null) {
		console.log("web id en getpass:" + webId);
		var url = webId.replace("profile/card#me","");
		url = url + "radarin/contraseña.txt";

		var pass = await(pod.getFile(url));
		console.log("Contraseña sacada"+pass);
		return pass;
	}
}*/

async function disconnect(){
	console.log("Logout");
	restapi.logout();
	logged=false;
}


async function connect() {
	let webId = (await auth.currentSession()).webId
	var url = webId.replace("profile/card#me","");
	
	url = url + "radarin/contraseña.txt";
	await pod.updateFile(url,"Hola buenos dias3");

	var response = await restapi.register(webId);
	console.log(response.status);
	if (response.status !== 200) { //El usuario ya está registrado
		console.log("Este es el webid" + webId);
		var pass = "aa"//await getPass(webId);
		console.log("Usuario ya está registrado");
		await getLocationLogin(webId,pass);
		logged = true;
		setTimeout(update,1000);
	}
	else {
		console.log(response);
		
		var url = webId.replace("profile/card#me","");
	
	 	url = url + "radarin/contraseña.txt";
		console.log(url);
		
		let pass = await response.text()
		pod.updateFile(url, pass);
		await getLocationLogin(webId, pass);
		logged=true;
		setTimeout(update,1000);
	}
}


async function update() {
	console.log("update iLogged="+isLogged());
	//;
	if( isLogged()){
		
	
	 navigator.geolocation.getCurrentPosition(async function f(pos) {
		var coords = {"lat":pos.coords.latitude, "lon":pos.coords.longitude}
		
		//console.log(coords);
		let response = await restapi.updateCoords(coords);
		console.log(await response.text());
	});
	setTimeout(update,10000);
	}
	
	
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
		console.log("Respuesta del login" + JSON.stringify(response));
	});
}

function isLogged() {
	return logged;
}

var toExport = {
	connect,
	update,
	isLogged,
	disconnect
}
export default toExport