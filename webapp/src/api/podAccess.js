
//import { VCARD } from "@inrupt/vocab-common-rdf";
import { foaf } from 'rdf-namespaces';
import auth from 'solid-auth-client';
import { createDocument,fetchDocument } from 'tripledoc';
import { space,solid, schema } from 'rdf-namespaces';
import { Pond } from 'rdf-namespaces/dist/schema';

function runFetch(fetchCall, f=p => p) {
	return fetchCall.then(p => p.text()).then(f)
}

/**
 * Devuelve el contenido de un archivo del pod del usuario
 * @param {string} filename Url del archivo en el pod del usuario
 * @param {function} f Función callback para llamadas asíncronas
 * @return {string} String con el contenido del archivo
 */
function getFile(filename, f) {
	return runFetch(auth.fetch(filename), f)
}

async function tripledoc(){
	const currentSession = await auth.currentSession();
	if (! currentSession) {
		return null;
	  }
	
	  const webIdDoc = await fetchDocument(currentSession.webId);


	const profile = webIdDoc.getSubject(currentSession.webId);

	 // Get the root URL of the user's Pod:
	 const storage = profile.getRef(space.storage);

	 const ref = storage+'public/prueba.txt';
	 const file = createDocument(ref);
	 await file.save();
}

async function fetchProfile () {
	const currentSession = await auth.currentSession();
    if (! currentSession) {
      return null;
    }
  
    const webIdDoc = await fetchDocument(currentSession.webId);
    const profile = webIdDoc.getSubject(currentSession.webId);
	
    let friends = await profile.getAllRefs(foaf.knows)
	return friends;
}

async function checkTodayFileAndCreate(url,nombreFichero){
	//Obtenemos los ficheros de ubicaciones.txt
	var ficheros=await getFile(url+"radarin/ubicaciones/ubicaciones.txt")
	ficheros = ficheros.split(" ");
	for(let i =0;i<ficheros.length;i++){
		if(ficheros[i] === nombreFichero)
			return;
	}
	
	//Si no ha encontrado el fichero con el nombre de hoy hay que crearlo
	await addToFile(url+"radarin/ubicaciones/ubicaciones.txt"," "+nombreFichero);
	//Creamos el json para el fichero
	var ubicaciones = [];
	var objeto = {};

	objeto.ubicaciones = ubicaciones;

	var json = JSON.stringify(objeto)

	await updateFile(url+"radarin/ubicaciones/"+nombreFichero, json); //Creamos el fichero con las ubicaciones de hoy
}



/**
 * Actualiza el contenido de un archivo del pod del usuario, si no existe se crea
 * @param {string} filename Url del archivo en el pod del usuario
 * @param {string} content Nuevo contenido del archivo
 * @param {function} f Función callback para llamadas asíncronas
 * @return {string} String con el retorno de la petición http
 */
function updateFile(filename, content, f) {
	//tripledoc();
	return runFetch(auth.fetch(filename, {
		method: "PUT", body: content
	}), f)
}

/**
 * Añade el contenido indicado al final de un archivo del pod del usuario
 * @param {string} filename Url del archivo en el pod del usuario
 * @param {string} toAdd Contenido a añadir al final del archivo
 * @param {function} f Función callback para llamadas asíncronas
 * @return {string} String con el retorno de la petición http
 */
async function addToFile(filename, toAdd, f) {
	return updateFile(filename, await getFile(filename) + toAdd, f)
}

/**
 * Borra un archivo del pod del usuario
 * @param {string} filename Url del archivo en el pod del usuario
 * @param {function} f Función callback para llamadas asíncronas
 * @return {string} String con el retorno de la petición http
 */
function deleteFile(filename, f) {
	return runFetch(auth.fetch(filename, {method: "DELETE"}), f)
}

var toExport = {
	getFile,
	updateFile,
	addToFile,
	checkTodayFileAndCreate,
	deleteFile,
	fetchProfile
}
export default toExport