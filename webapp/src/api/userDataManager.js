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
		//console.log("web id en getpass:" + webId);
		var url = webId.replace("profile/card#me", "");
		url = url + "public/password.txt";

		var pass = await (pod.getFile(url));
		console.log("Contraseña sacada" + pass);
		return pass;
	}
}

async function disconnect() {
	console.log("Logout");
	restapi.logout();
	logged = false;
	disconnected = true;
}


async function connect() {
	webId = (await auth.currentSession()).webId
	var url = webId.replace("profile/card#me", "");

	var response = await restapi.register(webId);
	console.log(response.status);
	if (response.status !== 200) { //El usuario ya está registrado
		console.log("Este es el webid" + webId);
		var pass = await getPass(webId);
		console.log("Usuario ya está registrado");
		await checkUbicationFile(webId);

		await getLocationLogin(webId, pass);
		logged = true;
		setTimeout(update, 1000);
	}
	else { //Registro del usuario
		console.log(response);


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
	//url+="radarin/ubicaciones/"+nombreFichero;
	await pod.checkTodayFileAndCreate(url, nombreFichero);
}


async function initializePod(pass, url) { //Inicializamos el POD cuando nos registramos
	const today = new Date(Date.now());
	var nombreFichero = today.getDate() + "" + (today.getMonth() + 1) + "" + today.getFullYear() + ".json";


	var urlUbicaciones = url + "public/ubicaciones.txt";
	var urlFicheroHoy = url + "public/" + nombreFichero;
	var urlPass = url + "public/password.txt";

	var ubicaciones = [];
	var objeto = {};

	objeto.ubicaciones = ubicaciones;

	var json = JSON.stringify(objeto)
	console.log(json);
	//var obj = await JSON.parse(initialJSON);

	//initialJSON  = await JSON.stringify(obj);
	//console.log(initialJSON);
	await pod.updateFile(urlPass, pass); //Creamos el fichero que tendrá la contraseña
	await pod.updateFile(urlUbicaciones, nombreFichero); //Creamos el fichero que tendrá los ficheros de ubicaciones
	await pod.updateFile(urlFicheroHoy, json); //Creamos el fichero que tendrá las ubicaciones en sí



}

async function update() {
	console.log("update iLogged=" + isLogged());

	if (isLogged()) {


		navigator.geolocation.getCurrentPosition(async function f(pos) {

			var coords = { "lat": pos.coords.latitude, "lon": pos.coords.longitude }

			if (lastLocation == null) {
				console.log("SIN COORDENADAS ANTERIORES");
				await restapi.updateCoords(coords);

			}
			else {
				console.log("CON COORDENADAS ANTERIORES");
				if (coordsManager.checkLastLocation(lastLocation, coords)) {
					await restapi.updateCoords(coords);
					console.log("Te has movido mas de 1km");
					coordsManager.addCoordToFile(coords);

				}
				else
					console.log("no te has movido");
			}
			//console.log(await response.text());
			lastLocation = coords;
		});
		setTimeout(update, 10000);
	}


}

async function getLocationLogin(webId, pass) {
	await navigator.geolocation.getCurrentPosition(async function f(pos) {
		var coords = { "lat": pos.coords.latitude, "lon": pos.coords.longitude }
		lastLocation = coords;
		console.log("Datos del login: " + webId, pass, coords);
		let response = await restapi.login(webId, pass, coords);
		//response = JSON.stringify(response);
		//connsole.log(response)
		if (response.error === "Login error") {
			console.log("ERROR EN EL LOGIN");
			return;
		}
		await coordsManager.addCoordToFile(coords); //En cada login añadimos la ubicación
		var friends = await pod.fetchProfile();
		console.log(friends);
		await restapi.addFriends(friends);

		logged = true
		//console.log("Respuesta del login" + response);

		radius = response.radius
	});

}

async function listarAmigos() {
	if (disconnected === true)
		return -1;

	var result = { cercanos: [], lejanos: [] };
	var response = await restapi.getFriendsCoords();

	if (response.status !== 200)
		return 0;

	var listAmigos = await response.json();
	for (var f of listAmigos.logged) {
		var fin = f.webId.indexOf(".inrupt");
		var inicio = f.webId.indexOf("//");

		f.webId = f.webId.slice(inicio + 2, fin);

		if (f.inAdviseDist) result.cercanos.push(f);
		else result.lejanos.push(f);
	}
	return {
      amigos: result,
      amigosNoLogeados: listAmigos.notLogged
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

var toExport = {
	connect,
	update,
	isLogged,
	disconnect,
	getRadius,
	listarAmigos
}
export default toExport