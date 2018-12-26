carkeeper = {

	source: null,

	api: function (method, args = {}, silent = false) {
		return new Promise(function(resolve, reject) {
			function processReject(error) {
				if(!silent) reject(error);
				else resolve(false);
			}
			let endpoint = window.location.host.match(/^(localhost|192)/) ? 'http://192.168.1.223:9090/' : 'https://api.carkeeper.pro/';
			fetch(endpoint + method, {
				method: 'POST',
				body: JSON.stringify(args)
			}).then(function (data) {
				return data.json();
			}).then(function (data) {
				if(data.hasOwnProperty('error')) processReject(data.error);
				else if(data.hasOwnProperty('result')) resolve(data.result);
				else processReject({ message: 'Invalid Server Response', code: 2 })
			}).catch(function (error) {
				processReject({ message: 'Network Error', code: 1, raw: error});
			});
		});
	},

	param: function (name) {
		let url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	},

	init: function (init = {}) {
		Object.assign(carkeeper, init);
		carkeeper.source = carkeeper.param('source') || localStorage.source || carkeeper.source || 'organic';
		localStorage.source = carkeeper.source;
		carkeeper.api('stats/pixel', { source: carkeeper.source });
	}

};
