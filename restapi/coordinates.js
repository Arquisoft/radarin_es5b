
const RADIANS_FACTOR = Math.PI / 180
const DEGREES_FACTOR = 180 / Math.PI

const toRadians = (angle) => angle * RADIANS_FACTOR
const toDegrees = (angle) => angle * DEGREES_FACTOR

EARTH_RADIUS = 6371

//Todos los cálculos de coordenadas han sido porteados
//de una entrega de la asignatura SEW, programados inicialmente en python

class Coords {
	
	/**
	 * Coordenadas de un punto, se almecenas como coordenadas cartesianas
	 * @param {number} longitude Longitud del punto, en grados
	 * @param {number} latitude Latitud del punto, en grados
	 * @param {number} radius Radio de la esfera en la que estarán las coordenadas
	 */
	constructor(coords, radius=EARTH_RADIUS) {
		
		let longitude = toRadians(coords.lon)
		this.z = Math.sin(toRadians(coords.lat)) * radius
		
		let x0 = Math.cos(longitude)
		let y0 = Math.sin(longitude)
		this.x = ((x0**2 * (radius**2 - this.z**2)) / (x0**2 + y0**2))**0.5
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
	constructor(p1, p2, radious=EARTH_RADIUS) {
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
			this.__linDist = ((this.p2.x - this.p1.x)**2 + (this.p2.y - this.p1.y)**2 + (this.p2.z - this.p1.z)**2)**0.5
		
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

function getDistance(p1, p2) {
	let distCalc = new DistCalc(new Coords(p1), new Coords(p2))
	let curvDist = distCalc.getCurvedDist()
	
	if (curvDist > 100)
		return curvDist
	
	else
		return (distCalc.getLinDist()**2 + Math.abs(p2.alt - p1.alt)**2)**0.5
}

module.exports = {getDistance}