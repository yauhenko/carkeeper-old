import * as Router from 'koa-router';
import Sessions from '../models/sessions';

const router = new Router();

router.post('/auth/ping', async (ctx) => {
	await Sessions.check(ctx);
	ctx.body = ctx.user;
});

router.post('/auth/logout', async (ctx) => {
	await Sessions.check(ctx);
	ctx.body = { closed: await Sessions.destroy(ctx.token) };
});

export default router.routes();
