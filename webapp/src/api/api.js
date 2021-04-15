import {updateFile,getFile} from "./podAccess";

//REACT_APP_API_URI is an enviroment variable defined in the file .env.development or .env.production
const apiEndPoint = process.env.REACT_APP_API_URI || "http://127.0.0.1:5000"



async function request(path, method, content=null) {
	let response = await fetch(apiEndPoint + path, {
		method: method,
		headers: {"Content-Type":"application/json"},
		body: content != null ? JSON.stringify(content) : null
	})
	return response
}

async function login(webid, pass, coords) {
	return await request("/user/login", "POST", {
		"webId": webid,
		"pass": pass,
		"coords": coords
	})
}

async function logout() {
	return await request("/user/logout", "GET")
}


async function getPass(webId){
	if(webId != null){
	console.log("web id en getpass:"+webId);
	var url = webId.replace("profile/card#me","");
	url = url+"radarin/contraseña.txt";

	var pass =await( getFile(url));
	console.log("Contraseña sacada"+pass);
	return pass;
	}
}

async function connect(webId){
	var response=  await (await register(webId)).text();
	console.log(response);
	if(response == 'Error'){ //El usuario ya está registrado
		console.log("Este es el webid"+webId);
		var pass = await getPass(webId);
		console.log("Usuario ya está registrado");
		await getLocationLogin(webId,pass);
		update()
	}
	else{
		console.log(response);
		
		var url = webId.replace("profile/card#me","");
	
	 	url = url+"radarin/contraseña.txt";
		console.log(url);
		updateFile(url,response);
		await getLocationLogin(webId,response);	
		update();
	}
	
}

 


async function update(){
	setTimeout(update,1000);
	 navigator.geolocation.getCurrentPosition(async function f(pos){
		var coords = {"lat":pos.coords.latitude,"lon":pos.coords.longitude,"alt":0}
		
		//console.log(coords);
		let response = await updateCoords(coords);
		console.log(await response.text());
	});
}

async function getLocationLogin(webId,pass){
	await navigator.geolocation.getCurrentPosition(async function f(pos){
		var coords = {"lat":pos.coords.latitude,"lon":pos.coords.longitude}
		
		console.log("Datos del login: "+webId,pass,coords);
		let response = await login(webId,pass,coords);
		console.log("Respuesta del login"+await response.headers);
	});
}

async function register(webid) {
	return await request("/user/register", "POST", {"webId": webid})
}

async function addFriends(friends) {
	return await request("/user/add_friends", "POST", friends)
}

async function getFriendsCoords() {
	return await request("/coords/friends/list", "GET")
}

async function updateCoords(coords) {
	return await request("/coords/update", "POST", {
		coords
	})
}

async function ban(webid) {
	return await request("/user/ban", "POST", {"webId": webid})
}

async function unban(webid) {
	return await request("/user/unban", "POST", {"webId": webid})
}

async function listUsers() {
	return await request("/user/list", "POST")
}

export default {
	login,
	logout,
	register,
	addFriends,
	getFriendsCoords,
	updateCoords,
	connect,
	ban,
	unban,
	listUsers
}