import * as Koa from 'koa';
import * as KoaBody from 'koa-body';
import * as KoaStatic from 'koa-static';
import * as KoaValidate from 'koa-validate';

import RouteUsers from './routes/users';
import RouteAuth from './routes/auth';
import RouteCars from './routes/cars';
import RouteGeo from './routes/geo';
import RouteGarage from './routes/garage';
import RouteUploads from './routes/uploads';

import './utils/cron';
import './utils/declare';

const server = new Koa();

server.use(KoaStatic(__dirname + '/public'));
server.use(KoaBody());

KoaValidate(server);

server.use(async (ctx, next) => {
    console.log('Request', ctx.req.url, ctx.request.body);
    try {
        await next();
        ctx.body = {result: ctx.body}
    } catch (e) {
        console.error(e);
        ctx.body = {error: e}
    }
    console.log('Response', ctx.body);
});

server.use(RouteUsers);
server.use(RouteAuth);
server.use(RouteCars);
server.use(RouteGeo);
server.use(RouteGarage);
server.use(RouteUploads);

server.listen(8000);

console.log('Server started');
