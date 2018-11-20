export default function api(method, args = {}, silent = false) {
	return new Promise((resolve, reject) => {
		function processReject(error) {
			if(!silent) reject(error);
			else resolve(false);
		}
		let endpoint = window.location.host.match(/^(localhost|192)/) ? 'http://192.168.1.223:9090/' : 'https://api.carkeeper.pro/';
		fetch(endpoint + method, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'Token': localStorage.token || ''
			},
			body: JSON.stringify(args)
		}).then(data => {
			return data.json();
		}).then((data) => {
			if(data.hasOwnProperty('error')) processReject(data.error);
			else if(data.hasOwnProperty('result')) resolve(data.result);
			else processReject({ message: 'unknown response' })
		}).catch((error) => {
			processReject(error);
		});
	});
}
