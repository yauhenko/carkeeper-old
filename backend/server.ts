import * as Koa from 'koa';
import * as KoaBody from 'koa-body';
import * as KoaStatic from 'koa-static';
import * as KoaSession from 'koa-session';

import './utils/declare';
import './utils/cron';

import RouteGeo from './routes/geo';
import RouteCars from './routes/cars';
import RouteAuth from './routes/auth';
import RouteUsers from './routes/users';
import RouteGarage from './routes/garage';
import RouteUploads from './routes/uploads';
import RouteAdmin from './routes/admin';

const server = new Koa();

server.keys = [
	'Exq7ng4R9VKvEHIwd3qxHXZTgCkAxWv2g19RIemaeYe8e1I57KkynBwSxjYEY4K9',
	'e1e23WDHldDrEaHX57VG9kMPF9P5ctUQsISB4kQSkL1KhDhHmv0cLGnVrtVj3irK',
	'91lIRPdXFwMZ7ZcbbBMnkLomgL7KjQDHg9vW9qr8pk27SYi0t9Srb97hMrMvGipt',
];

server.use(KoaStatic(__dirname + '/public'));
server.use(KoaBody());
server.use(KoaSession(server));

server.use(async (ctx, next) => {
	console.log('Request', ctx.req.url, ctx.request.body);
	try {
		await next();
		if (ctx.body) {
			if (typeof ctx.body !== 'string')
				ctx.body = { result: ctx.body }
		} else {
			ctx.status = 404;
			ctx.body = 'Not Found';
		}
	} catch (e) {
		console.error(e);
		ctx.body = { error: e }
	}
	console.log('Response', ctx.body);
});

server.use(RouteGeo);
server.use(RouteCars);
server.use(RouteAuth);
server.use(RouteUsers);
server.use(RouteGarage);
server.use(RouteUploads);
server.use(RouteAdmin);

server.listen(8000);

console.log('Server started');
