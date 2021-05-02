const crypto = require("crypto")

const HASHING_ALG = "sha256"
const PASS_SIZE = 128

function createRandomPass() {
	let pass = ""
	for (let i = 0; i < PASS_SIZE; i++)
		pass += parseInt(Math.random() * 255, 10).toString(16)
	
	return pass
}

function hashPass(pass) {
	return crypto.createHash(HASHING_ALG).update(pass).digest("hex")
}

module.exports = {createRandomPass, hashPass}