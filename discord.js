const request = require('request');

module.exports = class Discord {
	constructor(url) {
		this.requestUrl = url;
	}

	post(message) {
		let headers = {
			'Content-Type': 'application/json'
		}

		let options = {
			url: this.requestUrl,
			method: 'POST',
			headers: headers,
			json: true,
			form: {
				'content': message
			}
		}

		request(options, function(error, response, body) {
			if(error) console.log(response);
		});
	}
}
