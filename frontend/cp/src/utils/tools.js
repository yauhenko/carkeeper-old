export function range(n) {
	const arr = [];
	for(let i = 1; i <= n; i++) arr.push(i);
	return arr;
}

export function plural(val, str) {
	let  v = Math.abs(val) % 100, n = v % 10,
		p = (!n || n >= 5 || (v >= 5 && v <= 20)) ? 3 : ((n > 1 && n < 5) ? 2 : 1),
		s = str.split(',');
	return s[0] + s[p];
}
