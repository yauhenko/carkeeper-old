import * as Router from 'koa-router';
import { render } from '../utils';

const router = new Router({
	prefix: '/admin',
});

router.all('/login', async (ctx) => {
	if (ctx.session.logged) ctx.redirect('/admin/');

	let data: any = {};

	if (ctx.method === 'POST') {
		if (ctx.request.body.username === 'admin' && ctx.request.body.password === 'admin') {
			ctx.session.logged = true;
			ctx.redirect('/admin/');
		} else {
			data.error = 'access denied';
		}
	}

	ctx.body = await render('admin/login', data);
});

router.all('*', async (ctx, next) => {
	if (!ctx.session.logged) {
		ctx.redirect('/admin/login');
	} else {
		await next();
	}
});

router.get('/logout', async (ctx) => {
	ctx.session.logged = false;
	ctx.redirect('/admin/');
});

router.get('/', async (ctx) => {
	ctx.body = await render('admin/index');
});


export default router.routes();
