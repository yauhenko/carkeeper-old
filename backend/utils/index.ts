import * as ejs from 'ejs';

export async function render(template: string, data?: {}) {
	return await ejs.renderFile(__dirname + '/../views/' + template + '.ejs', data, {
		cache: true,
		await: true,
	});
}

export function passgen(length = 64): string {
	const a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
	const b = [];
	for (let i = 0; i < length; i++) {
		const j = (Math.random() * (a.length - 1)).toFixed(0);
		b[ i ] = a[ j ];
	}
	return b.join('');
}

export function uuid(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export function error(message: any = 'Неизвестная ошибка', code = -1): void {
	if (message instanceof Array) {
		let key = Object.keys(message[ 0 ])[ 0 ];
		message = message[ 0 ][ key ];
	}
	console.error(`Error ${code}: ${message}`);
	throw { message, code }
}

export function filterKeys(object: {}, keys: Array<string>): {} {
	let res = Object.assign({}, object);
	for (let key of Object.keys(res)) {
		if (keys.indexOf(key) === -1)
			delete res[ key ];
	}
	return res;
}
