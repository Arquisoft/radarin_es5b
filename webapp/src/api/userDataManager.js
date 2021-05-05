import restapi from "./api";
import pod from "./podAccess";
import auth from "solid-auth-client"
import coordsManager from "./coordsManager"
var logged = false;
var disconnected = false;
var lastLocation;
var webId;
var radius = null;

async function getPass(webId) {
	if (webId != null) {
		
		var url = webId.replace("profile/card#me", "");
		url = url + "public/radarinES5B/password.txt";

		var pass = await (pod.getFile(url));
		
		return pass;
	}
}

async function disconnect() {

	restapi.logout();
	logged = false;
	disconnected = true;
}


async function connect() {
	webId = (await auth.currentSession()).webId
	var url = webId.replace("profile/card#me", "");

	var response = await restapi.register(webId);

	if (response.status !== 200) { //El usuario ya está registrado
		
		var pass = await getPass(webId);
		
		await checkUbicationFile(webId);

		await getLocationLogin(webId, pass);
		logged = true;
		setTimeout(update, 1000);
	}
	else { //Registro del usuario
	


		url = webId.replace("profile/card#me", "");
		let pass = await response.text()
		await initializePod(pass, url); //Inicializamos los ficheros del pod donde se guardaran las ubicaciones


		await getLocationLogin(webId, pass);

		logged = true;
		setTimeout(update, 1000);
	}
	disconnected=false;

}
async function checkUbicationFile() {
	var url = webId.replace("profile/card#me", "");
	const today = new Date(Date.now());
	var nombreFichero = today.getDate() + "" + (today.getMonth() + 1) + "" + today.getFullYear() + ".json";
	
	await pod.checkTodayFileAndCreate(url, nombreFichero);
}


async function initializePod(pass, url) { //Inicializamos el POD cuando nos registramos
	const today = new Date(Date.now());
	var nombreFichero = today.getDate() + "" + (today.getMonth() + 1) + "" + today.getFullYear() + ".json";


	var urlUbicaciones = url + "public/radarinES5B/ubicaciones.txt";
	var urlFicheroHoy = url + "public/radarinES5B/ubicaciones/" + nombreFichero;
	var urlPass = url + "public/radarinES5B/password.txt";

	var ubicaciones = [];
	var objeto = {};

	objeto.ubicaciones = ubicaciones;

	var json = JSON.stringify(objeto)

	
	await pod.updateFile(urlPass, pass); //Creamos el fichero que tendrá la contraseña
	await pod.updateFile(urlUbicaciones, nombreFichero); //Creamos el fichero que tendrá los ficheros de ubicaciones
	await pod.updateFile(urlFicheroHoy, json); //Creamos el fichero que tendrá las ubicaciones en sí



}

async function update() {


	if (isLogged()) {


		navigator.geolocation.getCurrentPosition(async function f(pos) {

			var coords = { "lat": pos.coords.latitude, "lon": pos.coords.longitude }

			if (lastLocation == null) {
			
				await restapi.updateCoords(coords);

			}
			else {
			
				if (coordsManager.checkLastLocation(lastLocation, coords)) {
					await restapi.updateCoords(coords);
					
					coordsManager.addCoordToFile(coords);

				}
				//else
				//	console.log("no te has movido");
			}
		
			lastLocation = coords;
		});
		setTimeout(update, 10000);
	}


}

async function getLocationLogin(webId, pass) {
	await navigator.geolocation.getCurrentPosition(async function f(pos) {
		var coords = { "lat": pos.coords.latitude, "lon": pos.coords.longitude }
		lastLocation = coords;
		
		let response = await restapi.login(webId, pass, coords);
		//response = JSON.stringify(response);
		//connsole.log(response)
		if (response.error === "Login error") {
			
			return;
		}
		await coordsManager.addCoordToFile(coords); //En cada login añadimos la ubicación
		var friends = await pod.fetchProfile();
		
		await restapi.addFriends(friends);

		logged = true
		

		radius = response.radius
	});

}

const quitWebId = webId => webId.replace(/.*:[/][/]/, "").split(".")[0]

async function listarAmigos() {
	if (disconnected === true)
		return -1;

	var result = { cercanos: [], lejanos: [] };
	var response = await restapi.getFriendsCoords();

	if (response.status !== 200)
		return 0;
	
	var listAmigos = await response.json();
	for (var f of listAmigos.logged) {
		f.webId = quitWebId(f.webId);
		f.dist = quitDecimals(f.dist)

		if (f.inAdviseDist) result.cercanos.push(f);
		else result.lejanos.push(f);
	}
	return {
      amigos: result,
      amigosNoLogeados: listAmigos.notLogged.map(quitWebId)
    };
}

function isLogged() {
	return logged;
}

function getRadius() {
	let curRadius = radius
	radius = null
	return curRadius
}

function quitDecimals(num) {
	let splitted = num.toString().split(".")
	return splitted[0] + "." + splitted[1][0]
}

var toExport = {
	connect,
	update,
	isLogged,
	disconnect,
	getRadius,
	listarAmigos,
	quitWebId,
	quitDecimals
}
export default toExport