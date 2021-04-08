import auth from "solid-auth-client";

function runFetch(fetchCall, f=p => p) {
	return fetchCall.then(p => p.text()).then(f)
}

/**
 * Devuelve el contenido de un archivo del pod del usuario
 * @param {string} filename Url del archivo en el pod del usuario
 * @param {function} f Función callback para llamadas asíncronas
 * @return {string} String con el contenido del archivo
 */
export function getFile(filename, f) {
	return runFetch(auth.fetch(filename), f)
}

/**
 * Actualiza el contenido de un archivo del pod del usuario, si no existe se crea
 * @param {string} filename Url del archivo en el pod del usuario
 * @param {string} content Nuevo contenido del archivo
 * @param {function} f Función callback para llamadas asíncronas
 * @return {string} String con el retorno de la petición http
 */
export function updateFile(filename, content, f) {
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
export async function addToFile(filename, toAdd, f) {
	return updateFile(filename, await getFile(filename) + toAdd, f)
}

/**
 * Borra un archivo del pod del usuario
 * @param {string} filename Url del archivo en el pod del usuario
 * @param {function} f Función callback para llamadas asíncronas
 * @return {string} String con el retorno de la petición http
 */
export function deleteFile(filename, f) {
	return runFetch(auth.fetch(filename, {method: "DELETE"}), f)
}