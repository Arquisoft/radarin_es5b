const http = require("http")

class ApiRequester {
	
	constructor() {
		this.headers = {
			"Accept": "application/json;charset=UTF-8",
			"Content-Type": "application/json"
		}
	}
	
	setHeader(key, value) {
		this.headers[key] = value
	}
	
	request(addr, path, method, content, callback) {
		let options = {
			host: addr.ip,
			port: addr.port,
			path: path,
			method: method,
			headers: this.headers,
			rejectUnauthorized: false
		}
		
		let request = http.request(options, res => {
			res.setEncoding("utf-8")
			res.on("data", data => callback(res, data))
			res.on("error", err => callback(res, err))
		})
		
		if (content != null)
			request.write(JSON.stringify(content))
		
		request.end()
	}
}

module.exports = ApiRequester