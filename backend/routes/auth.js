import Router from 'koa-router';
import Sessions from "../models/sessions";

const router = new Router();

router.post('/auth/ping', async (ctx) => {
  await Sessions.check(ctx);
  ctx.body = ctx.user;
});

module.exports = router.routes();