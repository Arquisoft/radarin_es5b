import auth from 'solid-auth-client';
import pod from "./podAccess";

const RADIANS_FACTOR = Math.PI / 180
const DEGREES_FACTOR = 180 / Math.PI

const toRadians = (angle) => angle * RADIANS_FACTOR
const toDegrees = (angle) => angle * DEGREES_FACTOR

const EARTH_RADIUS = 6371

class Coords {

	/**
	 * Coordenadas de un punto, se almecenas como coordenadas cartesianas
	 * @param {number} longitude Longitud del punto, en grados
	 * @param {number} latitude Latitud del punto, en grados
	 * @param {number} radius Radio de la esfera en la que estarán las coordenadas
	 */
	constructor(coords, radius = EARTH_RADIUS) {

		let longitude = toRadians(coords.lon)
		this.z = Math.sin(toRadians(coords.lat)) * radius

		let x0 = Math.cos(longitude)
		let y0 = Math.sin(longitude)
		this.x = ((x0 ** 2 * (radius ** 2 - this.z ** 2)) / (x0 ** 2 + y0 ** 2)) ** 0.5
		if (x0 < 0)
			this.x = -this.x

		this.y = y0 * Math.abs(this.x / x0)
	}

	toString() {
		return `(${this.x}, ${this.y}, ${this.z})`
	}
}

class DistCalc {

	/**
	 * Calculador de distancia entre dos coordenadas
	 * @param {Coords} p1 Primera coordenada
	 * @param {Coords} p2 Segunda coordenada
	 * @param {number} radious Radio de la esfera sobre la que se medirá la distancia curva
	 */
	constructor(p1, p2, radious = EARTH_RADIUS) {
		this.p1 = p1
		this.p2 = p2
		this.radious = radious

		this.__linDist = null
		this.__curvDist = null
	}

	/**
	 * @return {number} Distancia en línea recta entre las dos coordenadas
	 */
	getLinDist() {
		if (this.__linDist == null)
			this.__linDist = ((this.p2.x - this.p1.x) ** 2 + (this.p2.y - this.p1.y) ** 2 + (this.p2.z - this.p1.z) ** 2) ** 0.5

		return this.__linDist
	}

	/**
	 * @return {number} Distancia sobre la superficie entre las dos coordenadas
	 */
	getCurvedDist() {
		if (this.__linDist == null)
			this.getLinDist()

		if (this.__curvDist == null) {
			let ang = toDegrees(Math.asin(this.__linDist / (2 * this.radious))) * 2
			this.__curvDist = 2 * this.radious * Math.PI * (ang / 360)
		}

		return this.__curvDist
	}
}




function calcularFicheroHoy(webId) {
	var url = webId.replace("profile/card#me", "");
	const today = new Date(Date.now());
	//	var nombreFichero = today.toLocaleDateString().replace("/", "").replace("/", "") + ".json" //El fichero tiene el nombre del dia de hoy
	var nombreFichero = today.getDate() + "" + (today.getMonth() + 1) + "" + today.getFullYear() + ".json";
	var urlFicheroHoy = url + "radarin/ubicaciones/" + nombreFichero;

	return urlFicheroHoy;
}


async function addCoordToFile(coords) {
	var webId = (await auth.currentSession()).webId
	var urlFicheroHoy = calcularFicheroHoy(webId);

	console.log("url fichero: " + urlFicheroHoy);
	var result = await pod.getFile(urlFicheroHoy);
	console.log("resultado: " + result);
	var json = JSON.parse(result);
	var hoy = new Date();

	json.ubicaciones.push({ "lat": coords.lat, "lon": coords.lon, "hour": hoy.getHours() + ":" + hoy.getMinutes() });

	pod.updateFile(urlFicheroHoy, JSON.stringify(json));
}

function checkLastLocation(p1, p2) {
	var result = new DistCalc(new Coords(p1), new Coords(p2)).getLinDist()
	console.log("distancia: " + result);
	return result > 1 //Cuando te mueves más de 1km
}

async function getLocations() {
	var webId = (await auth.currentSession()).webId
	var url = webId.replace("profile/card#me", "");
	var ubicaciones = await pod.getFile(url + "radarin/ubicaciones/ubicaciones.txt")
	
	var ficheros = ubicaciones.split(" ")
	console.log(ficheros);
	var result = []

	for(let i=0;i<ficheros.length;i++){
		var locations = JSON.parse(await pod.getFile(url + "radarin/ubicaciones/" + ficheros[i]));
		var location = locations.ubicaciones
		for(let j=0; j<location.length;j++){
			result.push(location[j]);
		}
		
		
	}
	return result;	
//	console.log("resultado:"+result);

//	console.log(JSON.stringify(result));
}

var toExport = {
	checkLastLocation,
	addCoordToFile,
	calcularFicheroHoy,
	getLocations
}
export default toExport