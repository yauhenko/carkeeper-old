import * as Koa from 'koa';
import * as KoaBody from 'koa-body';
import * as KoaStatic from 'koa-static';
//import * as KoaValidate from 'koa-validate';

import './utils/declare';
import './utils/cron';

import RouteGeo from './routes/geo';
import RouteCars from './routes/cars';
import RouteAuth from './routes/auth';
import RouteUsers from './routes/users';
import RouteGarage from './routes/garage';
import RouteUploads from './routes/uploads';

const server = new Koa();

server.use(KoaStatic(__dirname + '/public'));
server.use(KoaBody());

//KoaValidate(server);

server.use(async (ctx, next) => {
    console.log('Request', ctx.req.url, ctx.request.body);
    try {
        await next();
        if(ctx.body) {
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

server.listen(8000);

console.log('Server started');
